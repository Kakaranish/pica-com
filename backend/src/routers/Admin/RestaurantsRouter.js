import express from 'express';
import { param } from 'express-validator';
import { tokenValidatorMW, adminValidatorMW } from '../../auth/validators';
import { validationExaminator } from '../../common/middlewares';
import { withAsyncRequestHandler } from '../../common/utils';
import Restaurant from '../../db/models/Restaurant';

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
            req.restaurant.status = req.params.status;
            await req.restaurant.save();
            res.sendStatus(200);
        });
    }
)

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