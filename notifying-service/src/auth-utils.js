
import jwt from 'jsonwebtoken';

require('dotenv').config();

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

/**
 * @param {String} jwtRefreshToken
 */
export const decodeJwtRefreshToken = jwtRefreshToken => {
    try {
        return jwt.verify(jwtRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

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

export const interserviceTokenValidatorMW = async (req, res, next) => {
    const interserviceToken = decodeJwtInterserviceToken(req.body.interserviceToken);
    console.log(interserviceToken);
    if (!interserviceToken) return res.status(401).json({
        errors: ['unauthorized']
    });

    req.payload = interserviceToken;
    next();
};