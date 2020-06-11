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
            const restaurants = await Restaurant.find({ status: req.body.status });
            res.status(200).json(restaurants);
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

export default RestaurantsRouter;