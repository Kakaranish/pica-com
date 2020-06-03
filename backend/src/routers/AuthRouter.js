import express from "express";
import passport from "passport";
import { body, validationResult } from 'express-validator';
import RefreshToken from '../db/models/RefreshToken';
import {createAccessToken, createRefreshToken} from '../auth/utils';
import { decodeJwtAccessToken, decodeJwtRefreshToken, refreshAccessToken } from '../auth/utils';
import '../auth/passport-config';
import ProviderRouter from './ProviderRouter';

const AuthRouter = express();

AuthRouter.use('/provider', ProviderRouter);

AuthRouter.post('/register', registerValidators(), async (req, res) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req));

    passport.authenticate('register', { session: false },
        async (error, user) => {
            if (!user) return res.status(400).json({ errors: [error] });
            const refreshToken = await createRefreshToken(user);
            res.cookie('accessToken', createAccessToken(user), { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            res.sendStatus(200);
        }
    )(req, res);
});

AuthRouter.post('/login', loginValidators(), async (req, res, next) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req));
    passport.authenticate('login', async (_error, user) => {
        if (!user) return res.status(400).json({
            errors: [{
                param: 'email&password',
                msg: 'invalid email or password',
                location: 'body'
            }]
        });

        const refreshTokenDoc = await RefreshToken.findOne({ userId: user._id });
        res.cookie('accessToken', createAccessToken(user), { httpOnly: true });
        res.cookie('refreshToken', refreshTokenDoc.token, { httpOnly: true });
        return res.sendStatus(200);
    })(req, res, next);
});

AuthRouter.post('/logout', async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.sendStatus(200);
});

AuthRouter.post('/verify', async (req, res) => {
    const accessToken = decodeJwtAccessToken(req.cookies.accessToken);
    if (accessToken) return res.status(200).json({
        user: {
            provider: accessToken.provider,
            providerKey: accessToken.providerKey,
            role: accessToken.role
        }
    });

    const refreshToken = await decodeJwtRefreshToken(req.cookies.refreshToken);
    if (!refreshToken) return res.status(200).json({ user: null });

    const newAccessToken = await refreshAccessToken(req.cookies.refreshToken);
    if (!newAccessToken) return res.status(200).json({ user: null });
    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.status(200).json({
        user: {
            email: refreshToken.email,
            role: refreshToken.role
        }
    });
});

function registerValidators() {
    return [
        body('email').notEmpty().withMessage('cannot be empty').bail()
            .isEmail().withMessage('must have email format'),
        body('password').notEmpty().withMessage('cannot be empty'),
        body('firstName').notEmpty().withMessage('cannot be empty'),
        body('lastName').notEmpty().withMessage('cannot be empty')
    ];
}

function loginValidators() {
    return [
        body('email').notEmpty().withMessage('cannot be empty').bail()
            .isEmail().withMessage('must have email format'),
        body('password').notEmpty().withMessage('cannot be empty')
    ];
}

export default AuthRouter;