import express from "express";
import passport from "passport";
import RefreshToken from '../db/models/RefreshToken';
import { createAccessToken } from '../auth/utils';
import queryString from 'query-string';
import '../auth/passport-config';

require('dotenv').config();

const ProviderRouter = express();

ProviderRouter.get('/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email']
    })
);

ProviderRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
    async (req, res) => {
        const jwtAccessToken = createAccessToken(req.user.toIdentityJson());
        const jwtRefreshToken = (await RefreshToken.findOne({ userId: req.user._id })).token;
        res.cookie('accessToken', jwtAccessToken, { httpOnly: true });
        res.cookie('refreshToken', jwtRefreshToken, { httpOnly: true });

        res.redirect(`${process.env.FRONTEND_URI}/auth/success?${queryString.stringify(req.user.toProfileInfoJson())}`);
    }
);

ProviderRouter.get('/facebook',
    passport.authenticate('facebook', {
        session: false,
        scope: 'email'
    })
);

ProviderRouter.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/auth/login' }),
    async (req, res) => {
        const jwtRefreshToken = (await RefreshToken.findOne({ userId: req.user._id })).token;
        const jwtAccessToken = createAccessToken(req.user.toIdentityJson());
        res.cookie('accessToken', jwtAccessToken, { httpOnly: true });
        res.cookie('refreshToken', jwtRefreshToken, { httpOnly: true });

        res.redirect(`${process.env.FRONTEND_URI}/auth/success?${queryString.stringify(req.user.toProfileInfoJson())}`);
    }
);

export default ProviderRouter;