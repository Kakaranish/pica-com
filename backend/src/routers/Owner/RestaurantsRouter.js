import express from 'express';
import azure from 'azure-storage';
import mongoose from 'mongoose';
import { body, param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../../auth/validators';
import Restaurant from '../../db/models/Restaurant';
import { withAsyncRequestHandler, parseObjectId } from '../../common/utils';
import { validationExaminator, uploadImageMW } from '../../common/middlewares';
import { clearNotifsForEvent, notifyAdmins, notifyToastOnly } from '../../common/notif-utils';

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
                .select('name status description location categoryCodes createdAt images');
            res.status(200).json(restaurants);
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

RestaurantsRouter.get('/:id/menu', getMenuValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const menu = await Restaurant.findById(req.params.id)
            .populate('menu.pizzas menu.extraIngredients menu.extras menu.recommended -_id')
            .select('menu');
        res.status(200).json(menu.menu);
    });
});

RestaurantsRouter.get('/:id/delivery-info', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const restaurant = await Restaurant.findById(req.params.id)
            .select('deliveryPrice minFreeDeliveryPrice avgDeliveryTime avgPreparationTime');
        res.status(200).json(restaurant);
    });
});

RestaurantsRouter.get('/:id/populated', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const toPopulate = 'menu.pizzas menu.extraIngredients menu.extras ' +
            'menu.recommended categories';
        const restaurant = await Restaurant.findById(req.params.id)
            .populate(toPopulate);
        res.status(200).json(restaurant);
    });
});

RestaurantsRouter.get('/:id', tokenValidatorMW, ownerValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('categories');
        res.status(200).json(restaurant);
    });
});

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

RestaurantsRouter.put('/:id/status/:status', updateStatusValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const prevEventId = req.restaurant.statusEventId;
            const eventId = req.params.status !== 'PENDING'
                ? undefined
                : mongoose.Types.ObjectId();

            req.restaurant.status = req.params.status;
            req.restaurant.statusEventId = eventId;
            req.restaurant.save();

            if (prevEventId) await clearNotifsForEvent(prevEventId);
            if (eventId) notifyAdmins({
                eventId: eventId,
                notification: {
                    header: 'New pending restaurant',
                    content: `'${req.restaurant.name}' is waiting for approval`
                }
            });
            notifyToastOnly(req.identity, `You've changed restaurant status`);

            res.sendStatus(200);
        });
    }
);

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
                    },
                    categories: req.body.categories
                }
            });

            res.sendStatus(200);
        });
    }
);

RestaurantsRouter.put('/:id/delivery-info', updateDeliveryInfoValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.restaurant.deliveryPrice = req.body.deliveryPrice;
            req.restaurant.minFreeDeliveryPrice = req.body.minFreeDeliveryPrice;
            req.restaurant.avgDeliveryTime = req.body.avgDeliveryTime;
            req.restaurant.avgPreparationTime = req.body.avgPreparationTime;
            await req.restaurant.save();
            res.sendStatus(200);
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
            blobService.deleteBlobIfExists(process.env.BLOB_CONTAINER,
                req.image.blobName, err => console.log(err));
            blobService.deleteBlobIfExists(process.env.BLOB_CONTAINER,
                req.image.thumbnailBlobName, err => console.log(err));
            res.sendStatus(200);
        });
    }
);

function updateDeliveryInfoValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (restaurant.ownerId != req.identity.id)
                return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        }),
        body('deliveryPrice').isFloat({ min: 0 }).withMessage('must be float greater than 0')
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        body('minFreeDeliveryPrice').optional()
            .isFloat({ gt: 0 }).withMessage('must be float greater than 0')
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        body('avgDeliveryTime').isInt({ gt: 0 })
            .withMessage('must be int greater than 0'),
        body('avgPreparationTime').isInt({ gt: 0 })
            .withMessage('must be int greater than 0'),
        validationExaminator
    ];
}

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
        body('categories').isLength({ min: 1 })
            .withMessage('must have at least 1 element').bail()
            .customSanitizer(categories =>
                categories.map(cat => parseObjectId(cat)))
            .custom(categories => {
                if (categories.some(cat => cat === null))
                    throw new Error('at least 1 invalid category')
                return true;
            }),
        validationExaminator
    ];
}

function createDraftValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        body('name').notEmpty().withMessage('cannot be empty'),
        body('description').notEmpty().withMessage('cannot be empty'),
        body('city').notEmpty().withMessage('cannot be empty'),
        body('postcode').notEmpty().withMessage('cannot be empty'),
        body('address').notEmpty().withMessage('cannot be empty'),
        body('contactNumber').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
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