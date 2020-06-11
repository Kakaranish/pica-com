import express from 'express';
import azure from 'azure-storage';
import { body, validationResult, param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../auth/validators';
import Restaurant from '../db/models/Restaurant';
import { withAsyncRequestHandler } from '../common/utils';
import { validationExaminator, uploadImageMW } from '../common/middlewares';

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

RestaurantRouter.get('/:id', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const restaurant = await Restaurant.findById(req.params.id);
        res.status(200).json(restaurant);
    });
});

RestaurantRouter.get('/:id/images', miscPicUrlsValidationMWs(), async (req, res) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req).errors);
    withAsyncRequestHandler(res, async () => {
        res.status(200).json({
            name: req.restaurant.name,
            location: req.restaurant.location,
            images: req.restaurant.images
        });
    })
});

RestaurantRouter.post('/:id/image', miscPicUrlsValidationMWs(),
    uploadImageMW, async (req, res) => {

        if (!req.image) return res.status(400).json({
            errors: ['failed to upload image']
        });

        req.restaurant.images.push(req.image);
        await Restaurant.findByIdAndUpdate(req.params.id, {
            $set: { images: req.restaurant.images }
        });

        res.status(200).json(req.image);
    }
);

RestaurantRouter.delete('/:id/image', deletePicUrlValidationMWs(),
    async (req, res) => {

        req.restaurant.images = req.restaurant.images.filter(
            image => image.id !== req.body.imageId);

        await Restaurant.findByIdAndUpdate(req.params.id, {
            $set: { images: req.restaurant.images }
        });

        const blobService = azure.createBlobService();
        blobService.deleteBlobIfExists(req.image.blobContainer,
            req.image.blobName, err => console.log(err));

        res.sendStatus(200);
    }
);

RestaurantRouter.post('/', createDraftValidationMWs(), async (req, res) => {
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

RestaurantRouter.put('/:id/basic', updateBasicInfoValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            await Restaurant.findByIdAndUpdate(req.params.id, {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    contactNumber: req.body.contactNumber,
                    location: {
                        city: req.body.city,
                        postcode: req.body.postcode,
                        address: req.body.address
                    }
                }
            });

            res.sendStatus(200);
        });
    }
);

RestaurantRouter.get('/:id/menu', getMenuValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const menu = await Restaurant.findById(req.params.id)
            .populate('menu.pizzas menu.extraIngredients menu.extras menu.recommended -_id')
            .select('menu');
        res.status(200).json(menu.menu);
    });
});

function getMenuValidationMWs() {
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

function updateBasicInfoValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty'),
        body('name').notEmpty().withMessage('cannot be empty'),
        body('description').notEmpty().withMessage('cannot be empty'),
        body('city').notEmpty().withMessage('cannot be empty'),
        body('postcode').notEmpty().withMessage('cannot be empty'),
        body('address').notEmpty().withMessage('cannot be empty'),
        body('contactNumber').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

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
                const image = req.restaurant.images.find(i => i.id == value);
                if (!image) throw new Error('restaurant has no such image url');
                else req.image = image;

                return true;
            }),
        validationExaminator
    ];
}

export default RestaurantRouter;