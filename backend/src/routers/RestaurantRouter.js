import express from 'express';
import { body, validationResult, param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../auth/validators';
import Restaurant from '../db/models/Restaurant';
import { withAsyncRequestHandler } from '../common/utils';

const RestaurantRouter = express.Router();

RestaurantRouter.get('/', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        console.log(req.identity.id);
        const restaurants = await Restaurant.find({ ownerId: req.identity.id });
        res.status(200).json(restaurants);
    });
});

RestaurantRouter.get('/draft', tokenValidatorMW, ownerValidatorMW,
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const draftRestaurant = await Restaurant.findOne({
                ownerId: req.identity.id,
                status: 'DRAFT'
            });
            res.status(200).json(draftRestaurant);
        });
    }
);

RestaurantRouter.get('/:id/pic-urls/', getPicUrlsValidationMWs(), async (req, res) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req).errors);
    withAsyncRequestHandler(res, async () => {
        res.status(200).json({
            name: req.restaurant.name,
            location: req.restaurant.location,
            picUrls: req.restaurant.picUrls
        });
    })
});

RestaurantRouter.post('/draft', createDraftValidationMWs(), async (req, res) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req).errors);
    withAsyncRequestHandler(res, async () => {
        const restaurant = new Restaurant({
            ownerId: req.identity.id,
            name: req.body.name,
            description: req.body.description,
            contactNumber: req.body.contactNumber,
            location: {
                city: req.body.city,
                postcode: req.body.postcode,
                address: req.body.address
            }
        });
        await restaurant.save();

        res.status(200).json({ id: restaurant._id });
    });
});


function createDraftValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        restaurantInDraftValidatorMW,
        body('name').notEmpty().withMessage('cannot be empty'),
        body('description').notEmpty().withMessage('cannot be empty'),
        body('city').notEmpty().withMessage('cannot be empty'),
        body('postcode').notEmpty().withMessage('cannot be empty'),
        body('address').notEmpty().withMessage('cannot be empty'),
        body('contactNumber').notEmpty().withMessage('cannot be empty')
    ];
}

async function restaurantInDraftValidatorMW(req, res, next) {
    const ownerId = req.identity.id;
    const hasInDraft = await Restaurant.exists({
        ownerId, status: 'DRAFT'
    });
    if (hasInDraft) return res.status(400).json(
        { errors: ['owner has already other restaurant in draft'] });
    next();
}

function getPicUrlsValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (!restaurant || restaurant.ownerId != req.identity.id)
                return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        })
    ];
}

export default RestaurantRouter;