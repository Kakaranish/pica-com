import jwt from 'jsonwebtoken';
import User from '../db/models/User';
import RefreshToken from '../db/models/RefreshToken';
import { parseObjectId } from '../common/utils';

require('dotenv').config();

/**
 * @param {User} user 
 */
export const createAccessToken = user => {
    if (!user) return null;
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}

/**
 * @param {User} user 
 */
export const createRefreshToken = async user => {
    if (!user) return null;
    const userId = parseObjectId(user._id);
    if (!userId) return null;

    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET);
    const refreshToken = new RefreshToken({
        userId: user._id,
        token: token
    });
    await refreshToken.save();

    return token;
}

/**
 * @param {String} jwtRefreshToken 
 */
export const refreshAccessToken = async jwtRefreshToken => {
    let refreshToken = decodeJwtRefreshToken(jwtRefreshToken);
    if (!refreshToken || !parseObjectId(refreshToken.userId)) return null;

    const tokenExists = await RefreshToken.exists({
        userId: refreshToken.userId,
        token: jwtRefreshToken
    });
    if (!tokenExists) return null;
    return createAccessToken({
        _id: refreshToken.userId,
        email: refreshToken.email,
        role: refreshToken.role
    });
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