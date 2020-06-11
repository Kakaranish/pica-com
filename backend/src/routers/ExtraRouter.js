import express from 'express';
import { tokenValidatorMW, ownerValidatorMW } from '../auth/validators';
import { body, param } from 'express-validator';
import Restaurant from '../db/models/Restaurant';
import { validationExaminator } from '../common/middlewares';
import { withAsyncRequestHandler } from '../common/utils';
import Extra from '../db/models/Extra';

const ExtraRouter = express.Router();

ExtraRouter.post('/', createExtraValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const extra = new Extra({
                restaurantId: req.body.restaurantId,
                name: req.body.name,
                price: req.body.price
            });
            await extra.save();

            req.restaurant.menu.extras.push(extra._id);
            req.restaurant.save();
            res.sendStatus(200);
        });
    }
);

ExtraRouter.put('/:id', updateExtraValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.extra.name = req.body.name;
            req.extra.price = req.body.price;
            await req.extra.save();

            res.sendStatus(200);
        });
    }
);

ExtraRouter.delete('/:id', deleteExtraValidationMWs(),
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            req.extra.isDeleted = true;
            await req.extra.save();

            await Restaurant.findByIdAndUpdate(req.extra.restaurantId, {
                $pull: { 'menu.extras': req.params.id }
            });

            res.sendStatus(200);
        });
    }
);

function createExtraValidationMWs() {
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

function updateExtraValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const extra = (await Extra.findById(value)
                .populate('restaurant', 'ownerId'));
            if (extra.toObject().restaurant.ownerId != req.identity.id)
                return Promise.reject('no such extra');
            req.extra = extra;
        }),
        body('name').notEmpty().withMessage('cannot be empty'),
        body('price').isFloat({ gt: 0 }).withMessage('must be float greater than 0').bail()
            .customSanitizer(value => parseFloat(value.toFixed(2))),
        validationExaminator
    ];
}

function deleteExtraValidationMWs() {
    return [
        tokenValidatorMW,
        ownerValidatorMW,
        param('id').custom(async (value, { req }) => {
            const extra = await Extra.findById(value)
                .populate('restaurant', 'ownerId')
            if (extra.toObject().restaurant.ownerId != req.identity.id)
                return Promise.reject('no such extra');
            req.extra = extra;
        }),
        validationExaminator
    ];
}

export default ExtraRouter;