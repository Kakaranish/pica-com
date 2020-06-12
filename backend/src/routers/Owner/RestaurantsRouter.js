import express from 'express';
import azure from 'azure-storage';
import { body, param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../../auth/validators';
import Restaurant from '../../db/models/Restaurant';
import { withAsyncRequestHandler } from '../../common/utils';
import { validationExaminator, uploadImageMW } from '../../common/middlewares';

const RestaurantsRouter = express.Router();

require('dotenv').config();

RestaurantsRouter.get('/', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const restaurants = await Restaurant.find({ ownerId: req.identity.id });
        res.status(200).json(restaurants);
    });
});

RestaurantsRouter.get('/preview', tokenValidatorMW, ownerValidatorMW,
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const restaurants = await Restaurant.find({ ownerId: req.identity.id })
                .select('name status description location categoryCodes createdAt');
            res.status(200).json(restaurants);
        });
    }
);

RestaurantsRouter.get('/draft', tokenValidatorMW, ownerValidatorMW,
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const draftRestaurant = await Restaurant.findOne({
                ownerId: req.identity.id,
                status: 'DRAFT'
            });
            res.status(200).json(draftRestaurant._id);
        });
    }
);

RestaurantsRouter.put('/:id/status/:status', updateStatusValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.restaurant.status = req.params.status;
            req.restaurant.save();
            res.sendStatus(200);
        });
    }
);

RestaurantsRouter.get('/:id', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('menu.pizzas menu.extraIngredients menu.extras menu.recommended');
        res.status(200).json(restaurant);
    });
});

RestaurantsRouter.post('/:id/image', miscPicUrlsValidationMWs(),
    uploadImageMW, async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            if (!req.image) return res.status(400).json({
                errors: ['failed to upload image']
            });

            req.restaurant.images.push(req.image);
            await Restaurant.findByIdAndUpdate(req.params.id, {
                $set: { images: req.restaurant.images }
            });

            res.status(200).json(req.image);
        });
    }
);

RestaurantsRouter.delete('/:id/image', deletePicUrlValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.restaurant.images = req.restaurant.images.filter(
                image => image.id !== req.body.imageId);
            await req.restaurant.save();

            const blobService = azure.createBlobService();
            blobService.deleteBlobIfExists(req.image.blobContainer,
                req.image.blobName, err => console.log(err));
            blobService.deleteBlobIfExists(req.image.blobContainer,
                req.image.thumbnailBlobName, err => console.log(err));

            res.sendStatus(200);
        });
    }
);

RestaurantsRouter.post('/', createDraftValidationMWs(), async (req, res) => {
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

RestaurantsRouter.put('/:id/basic', updateBasicInfoValidationMWs(),
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

RestaurantsRouter.get('/:id/menu', getMenuValidationMWs(), async (req, res) => {
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
        body('contactNumber').notEmpty().withMessage('cannot be empty'),
        validationExaminator
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

function updateStatusValidationMWs() {
    const legalStatuses = ['draft', 'pending', 'cancelled'];
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('status').isIn(legalStatuses).withMessage('illegal status')
            .customSanitizer(value => value.toUpperCase()),
        param('id').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (restaurant.ownerId != req.identity.id)
                return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        }),
        validationExaminator
    ];
}

export default RestaurantsRouter;