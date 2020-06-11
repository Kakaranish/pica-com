import express from 'express';
import PizzaRouter from './PizzaRouter';
import ExtraIngredientRouter from './ExtraIngredientRouter';
import ExtraRouter from './ExtraRouter';
import RestaurantRouter from './RestaurantRouter';

const OwnerRouter = express.Router();

OwnerRouter.use('/restaurants', RestaurantRouter);
OwnerRouter.use('/pizza', PizzaRouter);
OwnerRouter.use('/extra-ingredient', ExtraIngredientRouter);
OwnerRouter.use('/extra', ExtraRouter);

export default OwnerRouter;