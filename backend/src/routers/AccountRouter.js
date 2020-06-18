import express from 'express';
import bcryptjs from 'bcryptjs';
import { body, param } from 'express-validator';
import { tokenValidatorMW } from '../auth/validators';
import { withAsyncRequestHandler } from '../common/utils';
import { validationExaminator } from '../common/middlewares';
import User from '../db/models/User';

const AccountRouter = express.Router();

AccountRouter.get('/profile', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findById(req.identity.id)
            .select('email firstName lastName');
        res.status(200).json(user);
    });
});

AccountRouter.put('/profile', updateProfileValidationMWs(), async (req, res) => {
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
});

AccountRouter.put('/password', changePasswordValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const encryptedPassword = await bcryptjs.hash(req.body.newPassword, 10);
        await User.updateOne({ _id: req.identity.id }, {
            $set: { password: encryptedPassword }
        });

        res.sendStatus(200);
    });
});

AccountRouter.get('/addresses', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findById(req.identity.id);
        if (!user?.addresses?.length) res.status(200).json([]);
        else res.status(200).json(user.addresses);
    });
});

AccountRouter.get('/address/:id', getAddressValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findById(req.identity.id);
        if (!user?.addresses) res.status(200).json(null);

        const address = user.addresses.find(a => a.id === req.params.id);
        res.status(200).json(address);
    });
});

AccountRouter.post('/address', createAddressValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findById(req.identity.id);
        if (!user) return res.sendStatus(404);

        if (!user.addresses) user.addresses = [];

        const address = {
            city: req.body.city,
            postcode: req.body.postcode,
            address: req.body.address,
            flatCode: req.body.flatCode
        };
        user.addresses.push(address);

        await User.findByIdAndUpdate(user.id, {
            $set: {
                addresses: user.addresses
            }
        });

        res.sendStatus(200);
    });
});

AccountRouter.put('/address/:id', updateAddressValidationMWs(), async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const user = await User.findById(req.identity.id);
        if (!user) return res.sendStatus(404);

        if (!user.addresses) user.addresses = [];
        const updatedAddress = {
            _id: req.params._id,
            city: req.body.city,
            postcode: req.body.postcode,
            address: req.body.address,
            flatCode: req.body.flatCode
        };
        const addressToUpdateIndex = user.addresses.findIndex(a =>
            a.id === req.params.id);
        user.addresses[addressToUpdateIndex] = updatedAddress;

        await User.findByIdAndUpdate(user.id, {
            $set: { addresses: user.addresses }
        });

        res.sendStatus(200);
    });
});

function updateProfileValidationMWs() {
    return [
        tokenValidatorMW,
        body('email').isEmail().withMessage('is not email'),
        body('firstName').notEmpty().withMessage('cannot be empty'),
        body('lastName').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

function changePasswordValidationMWs() {
    return [
        tokenValidatorMW,
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
            .withMessage('passwords are different'),
        validationExaminator
    ];
}

function createAddressValidationMWs() {
    return [
        tokenValidatorMW,
        body('city').notEmpty().withMessage('cannot be empty'),
        body('postcode').notEmpty().withMessage('cannot be empty'),
        body('address').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

function updateAddressValidationMWs() {
    return [
        param('id').notEmpty().withMessage('cannot be empty'),
        body('city').notEmpty().withMessage('cannot be empty'),
        body('postcode').notEmpty().withMessage('cannot be empty'),
        body('address').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

function getAddressValidationMWs() {
    return [
        tokenValidatorMW,
        param('id').notEmpty().withMessage('cannot be empty'),
        validationExaminator
    ];
}

export default AccountRouter;