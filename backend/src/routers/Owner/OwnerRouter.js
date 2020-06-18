import express from 'express';
import PizzaRouter from './PizzaRouter';
import ExtraIngredientRouter from './ExtraIngredientRouter';
import ExtraRouter from './ExtraRouter';
import RestaurantsRouter from './RestaurantsRouter';
import OrdersRouter from './OrdersRouter';

const OwnerRouter = express.Router();

OwnerRouter.use('/restaurants', RestaurantsRouter);
OwnerRouter.use('/pizza', PizzaRouter);
OwnerRouter.use('/extra-ingredient', ExtraIngredientRouter);
OwnerRouter.use('/extra', ExtraRouter);
OwnerRouter.use('/orders', OrdersRouter);

export default OwnerRouter;