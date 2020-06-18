import express from 'express';
import { tokenValidatorMW, ownerValidatorMW } from '../../auth/validators';
import { validationExaminator } from '../../common/middlewares';
import { withAsyncRequestHandler, calculateItemsTotalPrice } from '../../common/utils';
import Order from '../../db/models/Order';
import { param } from 'express-validator';

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
        });

        res.status(200).json(order);
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

export default OrdersRouter;