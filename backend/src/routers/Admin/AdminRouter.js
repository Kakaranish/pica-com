import express from 'express';
import UsersRouter from './UsersRouter';
import RestaurantsRouter from './RestaurantsRouter';

const AdminRouter = express.Router();

AdminRouter.use('/users', UsersRouter);
AdminRouter.use('/restaurants', RestaurantsRouter);

export default AdminRouter;