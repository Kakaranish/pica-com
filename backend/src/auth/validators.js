import {
    decodeJwtAccessToken,
    decodedTokenToIdentityJson,
    decodeJwtRefreshToken,
    refreshAccessToken
} from './utils';

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

    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    req.identity = decodedTokenToIdentityJson(decodedRefreshToken);
    next();
};