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
};

/**
 * @param {String} notifIdentityToken 
 */
export const decodeNotifIdentityToken = notifIdentityToken => {
    try {
        return jwt.verify(notifIdentityToken, process.env.NOTIF_IDENTITY_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};