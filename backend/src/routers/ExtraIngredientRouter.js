import express from 'express';
import { body, param } from 'express-validator';
import { tokenValidatorMW, ownerValidatorMW } from '../auth/validators';
import { validationExaminator } from '../common/middlewares';
import Restaurant from '../db/models/Restaurant';
import Extra from '../db/models/Extra';
import { withAsyncRequestHandler } from '../common/utils';

const ExtraIngredientRouter = express.Router();

ExtraIngredientRouter.post('/', createExtraIngredientValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const extraIngredient = new Extra({
                restaurantId: req.body.restaurantId,
                name: req.body.name,
                price: req.body.price
            });
            await extraIngredient.save();

            req.restaurant.menu.extraIngredients.push(extraIngredient._id);
            req.restaurant.save();
            res.sendStatus(200);
        });
    }
);

ExtraIngredientRouter.put('/:id', updateExtraIngredientValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.extraIngredient.name = req.body.name;
            req.extraIngredient.price = req.body.price;
            await req.extraIngredient.save();

            res.sendStatus(200);
        });
    }
);

ExtraIngredientRouter.delete('/:id', deleteExtraIngredientValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.extraIngredient.isDeleted = true;
            await req.extraIngredient.save();

            await Restaurant.findByIdAndUpdate(req.extraIngredient.restaurantId, {
                $pull: { 'menu.extraIngredients': req.params.id }
            });

            res.sendStatus(200);
        });
    }
);

function createExtraIngredientValidationMWs() {
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
        body('price').isFloat({ gt: 0 }).withMessage('must be float greater than 0').bail()
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        validationExaminator
    ];
}

function updateExtraIngredientValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const extraIngredient = (await Extra.findById(value)
                .populate('restaurant', 'ownerId'));
            if (extraIngredient.toObject().restaurant.ownerId != req.identity.id)
                return Promise.reject('no such extra ingredient');
            req.extraIngredient = extraIngredient;
        }),
        body('name').notEmpty().withMessage('cannot be empty'),
        body('price').isFloat({ gt: 0 }).withMessage('must be float greater than 0').bail()
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        validationExaminator
    ];
}

function deleteExtraIngredientValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const extraIngredient = await Extra.findById(value)
                .populate('restaurant', 'ownerId')
            if (extraIngredient.toObject().restaurant.ownerId != req.identity.id)
                return Promise.reject('no such extra ingredient');
            req.extraIngredient = extraIngredient;
        }),
        validationExaminator
    ];
}

export default ExtraIngredientRouter;