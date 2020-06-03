import passport from "passport";
import bcryptjs from "bcryptjs";
import User from '../db/models/User';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { createRefreshToken } from './utils';

require('dotenv').config();

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        if (await User.exists({ providerKey: email }))
            return done(`email '${email}' is already taken`, false);

        const user = new User({
            provider: 'CREDENTIALS',
            providerKey: email,
            password: await bcryptjs.hash(password, 10),
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        await user.save();

        return done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ provider: 'CREDENTIALS', providerKey: email });
        if (!user) return done('no user with such email', false);

        const passwordIsCorrect = await bcryptjs.compare(password, user.password);
        if (!passwordIsCorrect) return done('wrong password', false);

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

passport.use(new GoogleStrategy({
    callbackURL: 'http://localhost:9000/auth/provider/google/callback',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}, async (req, _accessToken, _refreshToken, profile, done) => {
    let user = await User.findOne({ provider: 'GOOGLE', providerKey: profile.id });

    if (!user) {
        const newUser = new User({
            provider: 'GOOGLE',
            providerKey: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
        });
        await newUser.save();

        await createRefreshToken(newUser);

        req.user = newUser;
        return done(null, newUser);
    }

    const profileInfoChanged = user.firstName !== profile.name.givenName ||
        user.lastName !== profile.name.familyName;
    if (profileInfoChanged) {
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        user.update();
    }
    req.user = user;
    done(null, user);
}));