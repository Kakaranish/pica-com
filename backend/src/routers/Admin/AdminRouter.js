import express from 'express';
import UsersRouter from './UsersRouter';
import RestaurantsRouter from './RestaurantsRouter';
import CategoriesRouter from './CategoriesRouter';

const AdminRouter = express.Router();

AdminRouter.use('/users', UsersRouter);
AdminRouter.use('/restaurants', RestaurantsRouter);
AdminRouter.use('/categories', CategoriesRouter);

export default AdminRouter;