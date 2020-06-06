import jwt from 'jsonwebtoken';

require('dotenv').config();

/**
 * @param {Object} identity 
 * @param {number} expiresInMs 
 */
export const createTestAccessToken = (identity, expiresInMs, secret = null) => {
    return jwt.sign(identity, secret ?? process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: `${expiresInMs}` });
}

/**
 * @param {Object} identity 
 */
export const createTestRefreshToken = (identity, secret = null) => {
    return jwt.sign(identity, secret ?? process.env.REFRESH_TOKEN_SECRET);
}