import {
    decodeJwtAccessToken,
    decodedTokenToIdentityJson,
    decodeJwtRefreshToken,
    refreshAccessToken
} from './utils';
import { cookieSettings } from '../../config';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

    res.cookie('accessToken', newAccessToken, cookieSettings);
    req.identity = decodedTokenToIdentityJson(decodedRefreshToken);
    next();
};

export const userValidatorMW = (req, res, next) => {
    if (req?.identity?.role !== 'USER')
        return res.status(401).json({ errors: ['user role required'] });
    next();
}

export const ownerValidatorMW = (req, res, next) => {
    if (req?.identity?.role !== 'OWNER')
        return res.status(401).json({ errors: ['owner role required'] });
    next();
}

export const adminValidatorMW = (req, res, next) => {
    if (req.identity.role !== 'ADMIN')
        return res.status(401).json({ errors: ['admin role required'] });
    next();
}