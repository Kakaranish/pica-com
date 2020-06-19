import express from 'express';
import moment from 'moment';
import { param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../../auth/validators';
import { validationExaminator } from '../../common/middlewares';
import { withAsyncRequestHandler, calculateItemsTotalPrice } from '../../common/utils';
import Order from '../../db/models/Order';
import { notify } from '../../common/notif-utils';

const OrdersRouter = express.Router();

OrdersRouter.get('/', getOrdersValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const orders = await Order.find().populate({
            path: 'restaurant',
            match: { ownerId: req.identity.id },
            select: 'ownerId name'
        });
        let ordersJson = orders.map(order => {
            const totalPrice = calculateItemsTotalPrice(order.pizzas,
                order.extras) + order.deliveryPrice;
            return Object.assign(order.toObject(), { totalPrice });
        });
        res.status(200).json(ordersJson);
    });
});

OrdersRouter.get('/:id', getOrderValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const order = await Order.findOne({
            _id: req.params.id
        }).populate({
            path: 'restaurant',
            match: { ownerId: req.identity.id },
            select: 'ownerId name'
        })
            .populate('pizzas.pizza pizzas.extraIngredients.extraIngredient extras.extra');

        let totalPrice = calculateItemsTotalPrice(order.pizzas, order.extras)
            + order.deliveryPrice;
        const orderJson = Object.assign(order.toObject(), { totalPrice });
        res.status(200).json(orderJson);
    });
});

OrdersRouter.put('/:id/status/:status', updateStatusValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const { avgPreparationTime, avgDeliveryTime } = req.order.toObject().restaurant;
        if (req.params.status === 'IN_PREPARATION') {
            req.order.estimatedDeliveryTime = moment()
                .add(avgPreparationTime + avgDeliveryTime, 'minutes');
        }
        else if (req.params.status === 'IN_DELIVERY') {
            req.order.estimatedDeliveryTime = moment()
                .add(avgDeliveryTime, 'minutes');
        }
        else req.order.estimatedDeliveryTime = undefined;

        req.order.status = req.params.status;
        await req.order.save();

        notify({
            identity: { id: req.order.userId},
            notification: {
                header: 'Order changed',
                content: `Status changed to "${req.params.status}"`
            }
        });

        res.sendStatus(200);
    });
});

function getOrdersValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW
    ];
}

function getOrderValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

function updateStatusValidationMWs() {
    const legalStatuses = ['INITIALIZED', 'IN_PREPARATION', 'IN_DELIVERY', 'COMPLETED'];
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty').bail()
            .custom(async (value, { req }) => {
                const order = await Order.findOne({
                    _id: value
                }).populate({
                    path: 'restaurant',
                    match: { ownerId: req.identity.id },
                    select: 'id avgDeliveryTime avgPreparationTime'
                });
                if (!order) return Promise.reject('no such order');

                req.order = order;
            }),
        param('status').notEmpty().withMessage('cannot be empty').bail()
            .isIn(legalStatuses).withMessage('invalid status'),
        validationExaminator
    ];
}

export default OrdersRouter;