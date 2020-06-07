import express from 'express';
import bcryptjs from 'bcryptjs';
import { param, body, validationResult } from 'express-validator';
import { tokenValidatorMW } from '../auth/validators';
import { withAsyncRequestHandler } from '../common/utils';
import User from '../db/models/User';

const AccountRouter = express.Router();

AccountRouter.get('/profile', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findById(req.identity.id)
            .select('email firstName lastName');
        res.status(200).json(user);
    });
});

AccountRouter.put('/profile', tokenValidatorMW, updateProfileValidationMWs(),
    async (req, res) => {
        if (validationResult(req).errors.length > 0)
            return res.status(400).json(validationResult(req).errors);

        withAsyncRequestHandler(res, async () => {
            await User.updateOne({ _id: req.identity.id }, {
                $set: {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }
            });

            res.sendStatus(200);
        });
    }
);

AccountRouter.put('/password', tokenValidatorMW, changePasswordValidationMWs(),
    async (req, res) => {
        if (validationResult(req).errors.length > 0)
            return res.status(400).json(validationResult(req).errors);

        withAsyncRequestHandler(res, async () => {
            const encryptedPassword = await bcryptjs.hash(req.body.newPassword, 10);
            await User.updateOne({ _id: req.identity.id }, {
                $set: { password: encryptedPassword }
            });

            res.sendStatus(200);
        });
    }
);

function updateProfileValidationMWs() {
    return [
        body('email').isEmail().withMessage('is not email'),
        body('firstName').notEmpty().withMessage('cannot be empty'),
        body('lastName').notEmpty().withMessage('cannot be empty')
    ];
}

function changePasswordValidationMWs() {
    return [
        body('oldPassword').notEmpty().withMessage('cannot be empty').bail()
            .custom(async (value, { req }) => {
                const user = await User.findById(req.identity.id);
                if (!await bcryptjs.compare(value, user.password))
                    return Promise.reject('invalid old password');
            }),
        body('newPassword').isLength(5)
            .withMessage('must have at least 5 characters'),
        body('confirmedNewPassword').isLength(5)
            .withMessage('must have at least 5 characters').bail()
            .custom((value, { req }) => value !== req.body.newPassord)
            .withMessage('passwords are different')
    ];
}

export default AccountRouter;