import express from "express";
import passport from "passport";
import { body, validationResult } from 'express-validator';
import RefreshToken from '../db/models/RefreshToken';
import {
    createAccessToken,
    createRefreshToken,
    decodedTokenToIdentityJson
} from '../auth/utils';
import {
    decodeJwtAccessToken,
    decodeJwtRefreshToken,
    refreshAccessToken
} from '../auth/utils';
import '../auth/passport-config';
import ProviderRouter from './ProviderRouter';
import { tokenValidatorMW } from "../auth/validators";

const AuthRouter = express();

AuthRouter.use('/provider', ProviderRouter);

AuthRouter.post('/register', registerValidators(), async (req, res) => {
    if (validationResult(req).errors.length > 0)
        return res.status(400).json(validationResult(req));

    passport.authenticate('register', { session: false },
        async (error, user) => {
            if (!user) return res.status(400).json({ errors: [error] });

            const jwtRefreshToken = await createRefreshToken(user.toIdentityJson());
            const jwtAccessToken = createAccessToken(user.toIdentityJson());
            res.cookie('accessToken', jwtAccessToken, { httpOnly: true });
            res.cookie('refreshToken', jwtRefreshToken, { httpOnly: true });

            res.status(200).json(user.toProfileInfoJson());
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

        const jwtAccessToken = createAccessToken(user.toIdentityJson());
        const jwtRefreshToken = (await RefreshToken.findOne({ userId: user._id })).token;
        res.cookie('accessToken', jwtAccessToken, { httpOnly: true });
        res.cookie('refreshToken', jwtRefreshToken, { httpOnly: true });

        res.status(200).json(user.toProfileInfoJson());
    })(req, res, next);
});

AuthRouter.post('/logout', async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.sendStatus(200);
});

AuthRouter.post('/logout/all', tokenValidatorMW, async (req, res) => {
    await RefreshToken.deleteOne({ userId: req.identity.id });
    await createRefreshToken(req.identity);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
});

AuthRouter.post('/verify', async (req, res) => {
    const decodedAccessToken = decodeJwtAccessToken(req.cookies.accessToken);
    if (decodedAccessToken) return res.status(200)
        .json({ identity: decodedAccessToken });

    const decodedRefreshToken = await decodeJwtRefreshToken(req.cookies.refreshToken);
    if (!decodedRefreshToken) return res.status(200).json({ identity: null });

    const newJwtAccessToken = await refreshAccessToken(req.cookies.refreshToken);
    if (!newJwtAccessToken) return res.status(200).json({ identity: null });
    res.cookie('accessToken', newJwtAccessToken, { httpOnly: true });
    res.status(200).json({ identity: decodedRefreshToken });
});

function registerValidators() {
    return [
        body('email').notEmpty().withMessage('cannot be empty').bail()
            .isEmail().withMessage('must have email format'),
        body('password').isLength({min: 5}).withMessage('min 5 characters required'),
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