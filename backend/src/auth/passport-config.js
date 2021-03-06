import passport from "passport";
import bcryptjs from "bcryptjs";
import User from '../db/models/User';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
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
            email: email,
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
    callbackURL: `${process.env.BACKEND_URI}/auth/provider/google/callback`,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}, async (req, _accessToken, _refreshToken, profile, done) => {
    
    let user = await User.findOne({ provider: 'GOOGLE', providerKey: profile.id });

    if (!user) {
        const newUser = createUserFromProfile(profile, 'GOOGLE');
        await newUser.save();

        await createRefreshToken(newUser.toIdentityJson());

        req.user = newUser;
        return done(null, newUser);
    }

    updateUserIfNeeded(user, profile);

    req.user = user;
    done(null, user);
}));

passport.use(new FacebookStrategy({
    callbackURL: `${process.env.BACKEND_URI}/auth/provider/facebook/callback`,
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    passReqToCallback: true,
    profileFields: ['id', 'email', 'displayName', 'name']
}, async (req, _accessToken, _refreshToken, profile, done) => {
    
    let user = await User.findOne({ provider: 'FACEBOOK', providerKey: profile.id });

    if (!user) {
        const newUser = createUserFromProfile(profile, 'FACEBOOK');
        await newUser.save();

        await createRefreshToken(newUser.toIdentityJson());

        req.user = newUser;
        return done(null, newUser);
    }

    updateUserIfNeeded(user, profile);

    req.user = user;
    done(null, user);
}));

/**
 * @param {import("passport").Profile} profile 
 * @param {String} provider
 */
const createUserFromProfile = (profile, provider) => {
    return new User({
        provider: provider,
        providerKey: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
    });
};

/**
 * @param {User} user 
 * @param {import("passport").Profile} profile 
 */
const updateUserIfNeeded = async (user, profile) => {
    const userChanged = user.firstName !== profile.name.givenName ||
        user.lastName !== profile.name.familyName;
    if (userChanged) {
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        await user.update();
    }
};