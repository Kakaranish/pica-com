import express from 'express';
import { withAsyncRequestHandler } from '../common/utils';
import Category from '../db/models/Category';

const MiscRouter = express.Router();

MiscRouter.get('/categories', async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const categories = await Category.find({ isDeleted: false });
        res.status(200).json(categories);
    });
});

export default MiscRouter;