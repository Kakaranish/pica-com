import express from 'express';
import { param, body, validationResult } from 'express-validator';
import { tokenValidatorMW, adminValidatorMW } from '../auth/validators';
import User from '../db/models/User';
import { withAsyncRequestHandler, parseObjectId } from '../common/utils';
import { reCreateRefreshToken } from '../auth/utils';

const AdminRouter = express.Router();

AdminRouter.get('/users', tokenValidatorMW, adminValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const users = await User.find({ providerKey: { $ne: 'root@pica.com' } })
            .select('_id provider providerKey firstName lastName');
        res.status(200).json(users);
    });
});

AdminRouter.get('/users/:id', tokenValidatorMW, adminValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findOne({ _id: req.params.id })
            .select('-password');
        
        res.status(200).json(user.providerKey === 'root@pica.com' ? null : user);
    });
});

AdminRouter.put('/users/:id', tokenValidatorMW,
    adminValidatorMW, updateUserValidationMWs(), async (req, res) => {
        if (validationResult(req).errors.length > 0)
            return res.status(400).json(validationResult(req).errors)

        withAsyncRequestHandler(res, async () => {
            await User.updateOne({ _id: req.params.id }, {
                $set: {
                    role: req.body.role,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                }
            });

            if (req.user.role !== req.body.role)
                reCreateRefreshToken(req.params.id);

            res.sendStatus(200);
        });
    }
);

function updateUserValidationMWs() {
    const allowedProviders = ['CREDENTIALS', 'GOOGLE', 'FACEBOOK'];
    const allowedRoles = ['USER', 'OWNNER', 'ADMIN'];

    return [
        body('provider').notEmpty().withMessage('cannot be empty').bail()
            .isIn(allowedProviders).withMessage('illegal provider'),
        body('providerKey').notEmpty().withMessage('cannot be empty'),
        param('id').customSanitizer(roomId => parseObjectId(roomId))
            .notEmpty().withMessage('invalid mongo ObjectId').bail()
            .custom(async (id, { req }) => {
                const user = await User.findOne({
                    _id: id,
                    provider: req.body.provider,
                    providerKey: req.body.providerKey,
                });

                if (!user) return Promise.reject('such user does not exist');
                else req.user = user;
            }),
        body('role').notEmpty().withMessage('cannot be empty').bail()
            .isIn(allowedRoles).withMessage('illegal role'),
        body('email').isEmail().withMessage('is not email'),
        body('firstName').notEmpty().withMessage('cannot be empty'),
        body('lastName').notEmpty().withMessage('cannot be empty')
    ];
}

export default AdminRouter;