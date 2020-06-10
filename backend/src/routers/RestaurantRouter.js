import express from 'express';
import azure from 'azure-storage';
import { body, validationResult, param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../auth/validators';
import Restaurant from '../db/models/Restaurant';
import { withAsyncRequestHandler } from '../common/utils';
import { uploadPictureMW, validationExaminator } from '../common/middlewares';

const RestaurantRouter = express.Router();

require('dotenv').config();

RestaurantRouter.get('/', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
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

RestaurantRouter.get('/:id/pic-urls/', miscPicUrlsValidationMWs(), async (req, res) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req).errors);
    withAsyncRequestHandler(res, async () => {
        res.status(200).json({
            name: req.restaurant.name,
            location: req.restaurant.location,
            pictures: req.restaurant.pictures
        });
    })
});

RestaurantRouter.post('/:id/pic-url', miscPicUrlsValidationMWs(),
    uploadPictureMW, async (req, res) => {

        if (!req.picture) return res.status(400).json({
            errors: ['failed to upload image']
        });

        req.restaurant.pictures.push(req.picture);
        await Restaurant.findByIdAndUpdate(req.params.id, {
            $set: { pictures: req.restaurant.pictures }
        });

        res.status(200).json(req.picture);
    }
);

RestaurantRouter.delete('/:id/pic-url', deletePicUrlValidationMWs(),
    async (req, res) => {

        req.restaurant.pictures = req.restaurant.pictures.filter(
            picture => picture.id !== req.body.imageId);

        await Restaurant.findByIdAndUpdate(req.params.id, {
            $set: { pictures: req.restaurant.pictures }
        });

        const blobService = azure.createBlobService();
        blobService.deleteBlobIfExists(req.picture.blobContainer, req.picture.blobName,
            err => console.log(err));

        res.sendStatus(200);
    }
);

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

function miscPicUrlsValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (!restaurant || restaurant.ownerId != req.identity.id)
                return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        }),
        validationExaminator
    ];
}

function deletePicUrlValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (!restaurant || restaurant.ownerId != req.identity.id)
                return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        }),
        body('imageId').notEmpty().withMessage('cannot be empty').bail()
            .custom((value, { req }) => {
                const picture = req.restaurant.pictures.find(p => p.id == value);
                if (!picture) throw new Error('restaurant has no such pic url');
                else req.picture = picture;

                return true;
            }),
        validationExaminator
    ];
}

export default RestaurantRouter;