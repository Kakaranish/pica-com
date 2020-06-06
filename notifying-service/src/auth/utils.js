import jwt from 'jsonwebtoken';

require('dotenv').config();

/**
 * @param {String} jwtInterserviceToken
 */
export const decodeJwtInterserviceToken = jwtInterserviceToken => {
    try {
        return jwt.verify(jwtInterserviceToken, process.env.INTERSERVICE_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * @param {String} jwtAccessToken 
 */
export const decodeJwtAccessToken = jwtAccessToken => {
    try {
        return jwt.verify(jwtAccessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}