import User from '../src/models/user-model';
import jwt from 'jsonwebtoken';

require('dotenv').config();

/**
 * @param {User} user 
 * @param {number} expiresInMs 
 */
export const createTestAccessToken = (user, expiresInMs, secret = null) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(jwtPayload, secret ?? process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: `${expiresInMs}` });
}

/**
 * @param {User} user 
 */
export const createTestRefreshToken = (user, secret = null) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(jwtPayload, secret ?? process.env.REFRESH_TOKEN_SECRET);
}