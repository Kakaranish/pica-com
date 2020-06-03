import passport from "passport";
import bcryptjs from "bcryptjs";
import User from '../db/models/User';

require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        if (await User.exists({ email: email }))
            return done(`email '${email}' is already taken`, false);

        const user = new User({
            email: email,
            password: await bcryptjs.hash(password, 10),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: "USER"
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
        const user = await User.findOne({ email: email });
        if (!user) return done('no user with such email', false);

        const passwordIsCorrect = await bcryptjs.compare(password, user.password);
        if (!passwordIsCorrect) return done('wrong password', false);

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));