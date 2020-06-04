import express from "express";
import passport from "passport";
import RefreshToken from '../db/models/RefreshToken';
import { createAccessToken } from '../auth/utils';
import queryString from 'query-string';
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

        const identity = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role
        };
        res.redirect(`http://localhost:3000/auth/success?${queryString.stringify(identity)}`);
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

        const identity = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            role: req.user.role
        };
        res.redirect(`http://localhost:3000/auth/success?${queryString.stringify(identity)}`);
    }
);

export default ProviderRouter;