import express from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';
import { tokenValidatorMW, adminValidatorMW } from '../../auth/validators';
import { validationExaminator } from '../../common/middlewares';
import { withAsyncRequestHandler } from '../../common/utils';
import Restaurant from '../../db/models/Restaurant';
import { clearNotifsForEvent, notifyAdmins, notify } from '../../common/notif-utils';

const RestaurantsRouter = express.Router();

RestaurantsRouter.get('/status/:status', getWithStatusValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const restaurants = await Restaurant.find({ status: req.params.status })
                .populate('owner');
            res.status(200).json(restaurants);
        });
    }
);

RestaurantsRouter.get('/:id/', getRestaurantValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const toPopulate = 'menu.pizzas menu.extraIngredients menu.extras '
                + 'menu.recommended categories';
            const restaurant = await Restaurant.findById(req.params.id)
                .populate(toPopulate);
            res.status(200).json(restaurant);
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
            await req.restaurant.save();

            if (prevEventId) await clearNotifsForEvent(prevEventId);
            if (eventId) notifyAdmins({
                eventId: eventId,
                notification: {
                    header: 'New pending restaurant',
                    content: `'${req.restaurant.name}' is waiting for approval`
                }
            });
            notify({
                identity: { id: req.restaurant.ownerId },
                notification: {
                    header: 'Restaurant Status',
                    content: `'${req.restaurant.name}' changed status to ${req.params.status}`
                }
            });

            res.sendStatus(200);
        });
    }
);

function getWithStatusValidationMWs() {
    const legalStatuses = ['pending', 'accepted', 'rejected', 'cancelled'];
    return [
        tokenValidatorMW,
        adminValidatorMW,
        param('status').isIn(legalStatuses).withMessage('illegal status').bail()
            .customSanitizer(value => value.toUpperCase()),
        validationExaminator
    ];
}

function getRestaurantValidationMWs() {
    return [
        tokenValidatorMW,
        adminValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

function updateStatusValidationMWs() {
    const legalStatuses = ['pending', 'accepted', 'rejected', 'cancelled'];
    return [
        tokenValidatorMW,
        adminValidatorMW,
        param('status').isIn(legalStatuses).withMessage('illegal status').bail()
            .customSanitizer(value => value.toUpperCase()),
        param('id').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (!restaurant) return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        }),
        param('id').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

export default RestaurantsRouter;