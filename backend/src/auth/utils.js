import jwt from 'jsonwebtoken';
import RefreshToken from '../db/models/RefreshToken';
import { parseObjectId } from '../common/utils';

require('dotenv').config();

/**
 * @param {any} payload 
 */
export const createInterserviceToken = payload => {
    if (!payload) return null;
    return jwt.sign(payload, process.env.INTERSERVICE_TOKEN_SECRET,
        { expiresIn: process.env.INTERSERVICE_TOKEN_EXPIRATION });
}

/**
 * @param {Object} identityJson 
 */
export const createAccessToken = identityJson => {
    if (!identityJson) return null;

    return jwt.sign(identityJson, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}

/**
 * @param {Object} identityJson 
 */
export const createRefreshToken = async identityJson => {
    if (!identityJson) return null;
    if (!parseObjectId(identityJson.id)) return null;

    const jwtToken = jwt.sign(identityJson, process.env.REFRESH_TOKEN_SECRET);
    const refreshToken = new RefreshToken({
        userId: identityJson.id,
        token: jwtToken
    });
    await refreshToken.save();

    return jwtToken;
}

/**
 * @param {String} jwtRefreshToken 
 */
export const refreshAccessToken = async jwtRefreshToken => {
    let decodedRefreshToken = decodeJwtRefreshToken(jwtRefreshToken);
    if (!decodedRefreshToken || !parseObjectId(decodedRefreshToken.id))
        return null;

    const identity = decodedTokenToIdentityJson(decodedRefreshToken);
    const tokenExists = await RefreshToken.exists({
        userId: identity.id,
        token: jwtRefreshToken
    });
    if (!tokenExists) return null;

    return createAccessToken(identity);
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

export const tokenValidatorMW = async (req, res, next) => {
    const decodedAccessToken = decodeJwtAccessToken(req.cookies.accessToken)
    if (decodedAccessToken) {
        req.identity = decodedTokenToIdentityJson(decodedAccessToken);
        return next();
    }

    const decodedRefreshToken = await decodeJwtRefreshToken(req.cookies.refreshToken);
    if (!decodedRefreshToken) return res.status(401).json({
        errors: ['cannot refresh access token - no/invalid refresh token provided']
    });

    const newAccessToken = await refreshAccessToken(req.cookies.refreshToken);
    if (!newAccessToken) return res.status(401).json({
        errors: ['cannot refresh access token - such user does not exist']
    });

    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    req.identity = decodedTokenToIdentityJson(decodedRefreshToken);
    next();
};

const decodedTokenToIdentityJson = payload => ({
    id: payload.id,
    provider: payload.provider,
    providerKey: payload.providerKey,
    role: payload.role   
})