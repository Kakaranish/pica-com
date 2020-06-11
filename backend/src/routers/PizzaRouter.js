import express from 'express';
import { body } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../auth/validators';
import { validationExaminator } from '../common/middlewares';
import { withAsyncRequestHandler } from '../common/utils';
import Pizza from '../db/models/Pizza';
import Restaurant from '../db/models/Restaurant';

const PizzaRouter = express.Router();

PizzaRouter.post('/', createPizzaValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const pizza = new Pizza({
            restaurantId: req.body.restaurantId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            diameter: req.body.diameter
        });
        await pizza.save();

        req.restaurant.menu.pizzas.push(pizza._id);
        await Restaurant.findByIdAndUpdate(req.restaurant.id, {
            $set: { 'menu.pizzas': req.restaurant.menu.pizzas }
        });

        res.status(200).json(pizza._id);
    });
});

PizzaRouter.put('/:id', updatePizzaValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        await Pizza.findOneAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                diameter: req.body.diameter,
                price: req.body.price
            }
        });
        res.sendStatus(200);
    });
});

function createPizzaValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        body('restaurantId').custom(async (value, { req }) => {
            const restaurant = await Restaurant.findById(value);
            if (!restaurant || restaurant.ownerId != req.identity.id)
                return Promise.reject('no such restaurant');
            req.restaurant = restaurant;
        }),
        body('name').notEmpty().withMessage('cannot be empty'),
        body('description').notEmpty().withMessage('cannot be empty'),
        body('price').isFloat({ gt: 0 }).withMessage('must be float greater than 0')
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        body('diameter').isInt({ gt: 0 }).withMessage('must be int greater than 0'),
        validationExaminator
    ];
}

function updatePizzaValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        body('pizzaId').custom(async (value, { req }) => {
            const pizza = (await Pizza.findById(value)
                .populate('restaurant', 'ownerId')).toObject();
            if (pizza.restaurant.ownerId != req.identity.id)
                return Promise.reject('no such pizza');
            req.pizza = pizza;
        }),
        body('name').notEmpty().withMessage('cannot be empty'),
        body('description').notEmpty().withMessage('cannot be empty'),
        body('price').isFloat({ gt: 0 }).withMessage('must be float greater than 0').bail()
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        body('diameter').isInt({ gt: 0 }).withMessage('must be int greater than 0'),
        validationExaminator
    ];
}

export default PizzaRouter;