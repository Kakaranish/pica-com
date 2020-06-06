import { decodeJwtInterserviceToken } from './utils';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const interserviceTokenValidatorMW = async (req, res, next) => {
    const decodedInterserviceToken = decodeJwtInterserviceToken(
        req.body.interserviceToken);

    if (!decodedInterserviceToken) return res.status(401)
        .json({ errors: ['unauthorized'] });

    req.payload = decodedInterserviceToken;
    next();
};