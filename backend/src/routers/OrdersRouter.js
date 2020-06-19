import express from 'express';
import moment from 'moment';
import { calculateItemsTotalPrice } from '../common/utils';
import { tokenValidatorMW } from '../auth/validators';
import { validationExaminator } from '../common/middlewares';
import { withAsyncRequestHandler, parseObjectId } from '../common/utils';
import { body, param } from 'express-validator';
import Restaurant from '../db/models/Restaurant';
import Pizza from '../db/models/Pizza';
import Extra from '../db/models/Extra';
import Order from '../db/models/Order';
import { notify } from '../common/notif-utils';

const OrdersRouter = express.Router();

OrdersRouter.get('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const toSelect = 'createdAt pizzas extras deliveryPrice ' +
            'restaurant restaurantId status'
        const orders = await Order.find({ userId: req.identity.id })
            .populate('restaurant', 'name location')
            .select(toSelect);
        let ordersJson = orders.map(order => {
            const totalPrice = calculateItemsTotalPrice(order.pizzas,
                order.extras) + order.deliveryPrice;
            return Object.assign(order.toObject(), { totalPrice });
        });

        res.status(200).json(ordersJson);
    });
});

OrdersRouter.get('/:id', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        let order = await Order.findOne({
            _id: req.params.id,
            userId: req.identity.id
        }).populate('pizzas.pizza pizzas.extraIngredients.extraIngredient extras.extra')
            .populate('restaurant', 'name location');
        if(!order) return res.status(200).json(null);

        let totalPrice = calculateItemsTotalPrice(order.pizzas, order.extras)
            + order.deliveryPrice;
        const orderJson = Object.assign(order.toObject(), { totalPrice });

        res.status(200).json(orderJson);
    });
});

OrdersRouter.post('/', createOrderValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        let pizzasPrices = {};
        req.pizzas.forEach(pizza => pizzasPrices[pizza._id] = pizza.price);

        let extraIngrsPrices = {};
        req.extraIngredients.forEach(extraIngr =>
            extraIngrsPrices[extraIngr._id] = extraIngr.price);

        let extrasPrices = {};
        req.extras.forEach(extra => extrasPrices[extra._id] = extra.price);

        req.body.pizzas.forEach(pizzaItem => {
            pizzaItem.pricePerPizza = pizzasPrices[pizzaItem.pizzaId];
            pizzaItem.pizza = pizzaItem.pizzaId;

            pizzaItem.extraIngredients = pizzaItem.extraIngredients.map(extraIngrItem => ({
                pricePerExtra: extraIngrsPrices[extraIngrItem],
                extraIngredient: extraIngrItem
            }));
        });

        req.body.extras.forEach(extraItem => {
            extraItem.pricePerExtra = extrasPrices[extraItem.extraId]
            extraItem.extra = [extraItem.extraId]
        });

        let deliveryPrice;
        if (req.restaurant.minFreeDeliveryPrice !== undefined) {
            const itemsTotalPrice = calculateItemsTotalPrice(req.body.pizzas,
                req.body.extras);
            deliveryPrice = itemsTotalPrice >= req.restaurant.minFreeDeliveryPrice
                ? 0
                : req.restaurant.deliveryPrice;
        }
        else deliveryPrice = req.restaurant.deliveryPrice;

        const order = new Order({
            userId: req.identity.id,
            restaurantId: req.body.restaurantId,
            pizzas: req.body.pizzas,
            extras: req.body.extras,
            deliveryPrice: deliveryPrice
        });
        await order.save();

        res.status(200).json(order._id);
    });
});

OrdersRouter.put('/:id/delivery-address', updateDeliveryAddressValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.order.deliveryAddress = {
                city: req.body.city,
                postcode: req.body.postcode,
                address: req.body.address,
                flatCode: req.body.flatCode
            };
            if (req.order.payment && req.order.status === 'INITIALIZED') {
                const restaurant = await Restaurant.findById(req.order.restaurantId)
                    .select('ownerId avgPreparationTime avgDeliveryTime');
                const remainingTime = restaurant.avgDeliveryTime
                    + restaurant.avgPreparationTime;

                req.order.estimatedDeliveryTime = moment().add(remainingTime, 'minutes');
                req.order.status = 'IN_PREPARATION';

                notify({
                    identity: { id: restaurant.ownerId },
                    notification: {
                        header: 'Notif header',
                        content: 'New order arrived!'
                    }
                });
            }

            await req.order.save();
            res.sendStatus(200);
        });
    }
);

OrdersRouter.put('/:id/payment', updatePaymentValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        req.order.payment = { method: req.body.method };
        if (req.body.transactionId)
            req.order.payment.transactionId = req.body.transactionId;

        if (req.order.deliveryAddress && req.order.status === 'INITIALIZED') {
            const restaurant = await Restaurant.findById(req.order.restaurantId)
                .select('ownerId avgPreparationTime avgDeliveryTime');
            const remainingTime = restaurant.avgDeliveryTime
                + restaurant.avgPreparationTime;

            req.order.estimatedDeliveryTime = moment().add(remainingTime, 'minutes');
            req.order.status = 'IN_PREPARATION';

            notify({
                identity: { id: restaurant.ownerId },
                notification: {
                    header: 'Notif header',
                    content: 'New order arrived!'
                }
            });
        }

        await req.order.save();
        res.sendStatus(200);
    });
});

function createOrderValidationMWs() {
    return [
        tokenValidatorMW,
        body('restaurantId').notEmpty().withMessage('cannot be empty').bail()
            .custom(async (value, { req }) => {
                const restaurant = await Restaurant.findOne({
                    _id: value,
                    status: 'ACCEPTED'
                });
                if (!restaurant) return Promise.reject('no such restaurant');
                req.restaurant = restaurant;
            }),
        body('pizzas').isArray().withMessage('must be array').bail()
            .custom(async (pizzas, { req }) => {
                if (pizzas.some(p => parseObjectId(p.pizzaId) === null))
                    return Promise.reject('some pizza id is invalid');

                const pizzaIds = Array.from(new Set(pizzas.map(p => p.pizzaId)));
                const pizzaDocs = await Pizza.find({
                    _id: { $in: pizzaIds }
                });
                if (pizzaDocs.length !== pizzaIds.length)
                    return Promise.reject('some pizza does not exist');

                let extraIngrIds = [];
                pizzas.forEach(p => {
                    extraIngrIds = extraIngrIds.concat(p.extraIngredients)
                });
                const uniqueExtraIngrIds = Array.from(new Set(extraIngrIds));

                const extraIngrDocs = await Extra.find({
                    _id: { $in: uniqueExtraIngrIds }
                });
                if (extraIngrDocs.length !== uniqueExtraIngrIds.length)
                    return Promise.reject('some extra ingredient does not exist');

                req.pizzas = pizzaDocs;
                req.extraIngredients = extraIngrDocs;
            }),
        body('extras').isArray().withMessage('must be array').bail()
            .custom(async (extras, { req }) => {
                if (extras.some(e => parseObjectId(e.extraId) === null))
                    return Promise.reject('some extra id is invalid');

                const extraIds = Array.from(new Set(extras.map(e => e.extraId)));
                const extraDocs = await Extra.find({ _id: { $in: extraIds } });
                if (extraDocs.length !== extraIds.length)
                    return Promise.reject('some extra does not exist');

                req.extras = extraDocs;
            }),
        validationExaminator
    ];
}

function updateDeliveryAddressValidationMWs() {
    return [
        tokenValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty').bail()
            .custom(async (value, { req }) => {
                const order = await Order.findById(value);
                if (order.userId != req.identity.id)
                    return Promise.reject('no such order');
                req.order = order;
            }),
        body('city').notEmpty().withMessage('cannot be empty'),
        body('postcode').notEmpty().withMessage('cannot be empty'),
        body('address').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

function updatePaymentValidationMWs() {
    const legalMethods = ['ON_DELIVERY', 'BLIK', 'PAYU'];
    return [
        tokenValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty').bail()
            .custom(async (value, { req }) => {
                const order = await Order.findById(value);
                if (order.userId != req.identity.id)
                    return Promise.reject('no such order');
                if (order.payment)
                    return Promise.reject('order is already paid');
                req.order = order;
            }),
        body('method').notEmpty().withMessage('cannot be empty').bail()
            .isIn(legalMethods).withMessage('illegal method code'),
        body('transactionId').custom((value, { req }) => {
            if (req.body.method !== 'ON_DELIVERY' && !value)
                throw new Error('cannot be empty');
            return true;
        }),
        validationExaminator
    ];
}

export default OrdersRouter;