import express from "express";
import passport from "passport";
import RefreshToken from '../db/models/RefreshToken';
import { createAccessToken } from '../auth/utils';
import '../auth/passport-config';

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
        const refreshToken = await RefreshToken.findOne({ userId: req.user._id });
        res.cookie('accessToken', createAccessToken(req.user), { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect('/');
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
        const refreshToken = await RefreshToken.findOne({ userId: req.user._id });
        res.cookie('accessToken', createAccessToken(req.user), { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect('/');
    }
);

export default ProviderRouter;