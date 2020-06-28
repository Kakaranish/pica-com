import express from 'express';
import { withAsyncRequestHandler, parseObjectId, normalizeText } from '../common/utils';
import Restaurant from '../db/models/Restaurant';
import Opinion from '../db/models/Opinion';
import Order from '../db/models/Order';
import { tokenValidatorMW } from '../auth/validators';
import { param, body, query } from 'express-validator';
import { validationExaminator } from '../common/middlewares';

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

RestaurantsRouter.get('/:id/opinions', async (req, res) => {
  withAsyncRequestHandler(res, async () => {
    const restaurant = await Restaurant.findById(req.params.id)
      .select('name');
    const opinions = await Opinion.find({
      restaurantId: req.params.id
    });
    res.status(200).json({
      opinions,
      restaurant
    });
  });
});

RestaurantsRouter.get("/", getRestaurantsValidationMWs(), async (req, res) => {
  withAsyncRequestHandler(res, async () => {
    const toPopulate = "categories";
    const toExclude = "-ownerId -status -creteadAt -updatedAt";

    const filters = {
      status: "ACCEPTED",
      "location.normalizedCity": req.query.city
    };

    if (req.query.categoryId)
      filters.categories = { _id: req.query.categoryId };

    if (req.query.minFreeDeliveryPrice)
      filters.$or = [
        { deliveryPrice: { $eq: 0 } },
        { minFreeDeliveryPrice: { $lte: req.query.minFreeDeliveryPrice } }
      ];

    if (req.query.deliveryPrice)
      filters.deliveryPrice = { $lte: req.query.deliveryPrice };

    if (req.query.starRating)
      filters.avgStarRating = { $gte: req.query.starRating };

    const restaurants = await Restaurant.find(filters)
      .populate(toPopulate)
      .select(toExclude);

    res.status(200).json(restaurants);
  });
});

RestaurantsRouter.post('/:id/opinions', addOpinionValidationMWs(),
  async (req, res) => {
    withAsyncRequestHandler(res, async () => {
      let opinionJson = {
        userId: req.identity.id,
        orderId: req.body.orderId,
        restaurantId: req.params.id,
        starRating: req.body.starRating
      };
      if (req.body.content) opinionJson.content = req.body.content;

      const opinion = new Opinion(opinionJson);
      await opinion.save();

      const result = await Opinion.aggregate([{
        $match: { restaurantId: parseObjectId(req.params.id) }
      }, {
        $group: {
          _id: { restaurantId: "$restaurantId" },
          starRating: { $avg: "$starRating" }
        }
      }]);
      const avgStarRating = result[0].starRating;

      req.restaurant.avgStarRating = avgStarRating;
      await req.restaurant.save();

      res.sendStatus(200);
    });
  }
);

function getRestaurantsValidationMWs() {
  return [
    query('city').notEmpty().withMessage('cannot be empty').bail()
      .customSanitizer(city => normalizeText(city)),
    query('categoryId').optional()
      .customSanitizer(value => parseObjectId(value))
      .custom(value => { if (!value) throw Error('invalid mongo ObjectId'); return true; }),
    query('minFreeDeliveryPrice').optional().isInt({ gt: 0 }),
    query('deliveryPrice').optional().isInt({ gt: 0 }),
    query('starRating').optional().isInt({ min: 1, max: 5 }),
    validationExaminator
  ];
}

function addOpinionValidationMWs() {
  return [
    tokenValidatorMW,
    param('id').notEmpty().withMessage('cannot be empty').bail()
      .custom(async (value, { req }) => {
        const restaurant = await Restaurant.findById(value);
        if (!restaurant) return Promise.reject('no such restaurant');

        req.restaurant = restaurant;
      }),
    body('orderId').notEmpty().withMessage('cannot be empty').bail()
      .custom(async value => {
        const order = await Order.findById(value);
        if (!order) return Promise.reject('no such order');

        const exists = await Opinion.exists({ orderId: value });
        if (exists) return Promise.reject('order has opinion');
      }),
    body('starRating').isInt({ min: 1, max: 5 }).withMessage('invalid value'),
    body('content').optional(),
    validationExaminator
  ];
}

export default RestaurantsRouter;