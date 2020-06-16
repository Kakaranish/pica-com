import express from 'express';
import { withAsyncRequestHandler } from '../common/utils';
import Restaurant from '../db/models/Restaurant';

const RestaurantsRouter = express.Router();

RestaurantsRouter.get('/:id/populated', async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const toPopulate = 'menu.pizzas menu.extraIngredients menu.extras '
            + 'menu.recommended categories';
        const toExclude = '-ownerId -status -statsEventId -creteadAt -updatedAt';
        const restaurant = await Restaurant.findOne({
            _id: req.params.id,
            status: 'ACCEPTED'
        }).populate(toPopulate)
            .select(toExclude);

        res.status(200).json(restaurant);
    });
});

export default RestaurantsRouter;