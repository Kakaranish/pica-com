import express from 'express';
import { body, param } from 'express-validator';
import { tokenValidatorMW, adminValidatorMW } from '../../auth/validators';
import Category from '../../db/models/Category';
import { validationExaminator } from '../../common/middlewares';
import { withAsyncRequestHandler } from '../../common/utils';

const CategoriesRouter = express.Router();

CategoriesRouter.post('/', createCategoryValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const category = new Category({ name: req.body.name });
        await category.save();
        res.sendStatus(200);
    });
});

CategoriesRouter.put('/:id', updateCategoryValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        req.category.name = req.body.name;
        await req.category.save();
        res.sendStatus(200);
    });
});

CategoriesRouter.delete('/:id', deleteCategoryValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        req.category.isDeleted = true;
        await req.category.save();
        res.sendStatus(200);
    });
});

function createCategoryValidationMWs() {
    return [
        tokenValidatorMW,
        adminValidatorMW,
        body('name').notEmpty().withMessage('cannot be empty').bail()
            .custom(async value => {
                const otherExists = await Category.exists(
                    { name: value, isDeleted: false });
                if (otherExists) return Promise.reject('category with such name exists');
            }),
        validationExaminator
    ];
}

function updateCategoryValidationMWs() {
    return [
        tokenValidatorMW,
        adminValidatorMW,
        param('id').custom(async (value, { req }) => {
            const category = await Category.findById(value);
            if (!category) return Promise.reject('no such category');
            req.category = category;
        }),
        body('name').notEmpty().withMessage('cannot be empty').bail()
            .custom(async value => {
                const otherExists = await Category.exists(
                    { name: value, isDeleted: false });
                if (otherExists) return Promise.reject('category with such name exists');
            }),
        validationExaminator
    ];
}

function deleteCategoryValidationMWs() {
    return [
        tokenValidatorMW,
        adminValidatorMW,
        param('id').custom(async (value, { req }) => {
            const category = await Category.findOne({ _id: value, isDeleted: false });
            if (!category) return Promise.reject('nothing to delete');
            req.category = category;
        }),
        validationExaminator
    ];
}

export default CategoriesRouter;