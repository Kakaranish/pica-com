import mongoose from 'mongoose';
import { connectTestDb } from '../../src/db/utils';
import RefreshToken from '../../src/db/models/RefreshToken';
import User from '../../src/db/models/User';
import {
    tokenValidatorMW,
    userValidatorMW,
    adminValidatorMW,
    ownerValidatorMW
} from '../../src/auth/validators';
import * as AuthUtils from '../../src/auth/utils';
import * as TestUtils from '../test-utils';
import * as Mocks from 'node-mocks-http';

const userId = '5edb974ae989fe0233637691';
let user;
let refreshToken;
beforeAll(async () => {
    await connectTestDb();

    user = await User.findById(userId);
    if (!user) throw Error('cannot get test user');

    refreshToken = await RefreshToken.findOne({ userId: user._id });
    if (!refreshToken) throw Error('cannot get test user token');
});


describe('tokenValidatorMW', () => {
    it('When access token is valid and not expired then next middleware is called', async () => {
        // Arrange:
        const anyUserId = '5eb3ea7adc39c3c9fc66caaa';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        };
        const accessToken = TestUtils.createTestAccessToken(identity, 10 * 1000);

        const req = Mocks.createRequest({
            cookies: { accessToken: accessToken }
        });
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        await tokenValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalledTimes(1);
        res.on('end', () => {
            expect(res._getStatusCode()).toBe(200);
            expect(res._getJSONData().errors).toBeUndefined();
            expect(parseObjectId(res._getJSONData().body.identity.id)).not.toBeNull();
            expect(parseObjectId(res._getJSONData().body.identity.id)).not.toBeUndefined();
            expect(res._getJSONData().body.identity.provider).not.toBeUndefined();
            expect(res._getJSONData().body.identity.providerKey).not.toBeUndefined();
            expect(res._getJSONData().body.identity.role).not.toBeUndefined();
        });
    });

    it('When refresh token is invalid or not matching to user then error is returned', async () => {
        // Arrange:
        const req = Mocks.createRequest({
            cookies: { accessToken: 'INVALID' }
        });
        const res = Mocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        const next = jest.fn();

        // Act:
        await tokenValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalledTimes(0);
        res.on('end', () => {
            expect(res._getStatusCode()).toBe(401);
            expect(res._getJSONData().errors).toHaveLength(1);
            expect(res._getJSONData().errors[0].includes('no/invalid refresh'));
        });
    });

    it('When new access token cannot be generated then error is returned', async () => {
        // Arrange:
        const invalidIdentity = {
            _id: mongoose.Types.ObjectId(),
            provider: 'CREDENTIALS',
            providerKey: 'nosuchuser@mail.com',
            role: 'USER'
        };
        const refreshToken = TestUtils.createTestRefreshToken(invalidIdentity);
        const req = Mocks.createRequest({
            cookies: {
                accessToken: 'INVALID',
                refreshToken: refreshToken
            }
        });
        const res = Mocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        const next = jest.fn();

        // Act:
        await tokenValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalledTimes(0);
        res.on('end', () => {
            expect(res._getStatusCode()).toBe(401);
            expect(res._getJSONData().errors).toHaveLength(1);
            expect(res._getJSONData().errors[0].includes('such user does not exist'));
        });
    });

    it('When access token is expired then new access token is generated and sent as cookie and user is set in req body and next middleware is called', async () => {
        // Arrange:
        const expiredAccessToken = TestUtils.createTestAccessToken(user.toIdentityJson(), 1);
        const req = Mocks.createRequest({
            cookies: {
                accessToken: expiredAccessToken,
                refreshToken: refreshToken.token
            }
        });
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        await tokenValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalledTimes(1);
        expect(res.cookies.accessToken).not.toBeUndefined();
        expect(res.cookies.accessToken.options.httpOnly).toBe(true);
        const accessToken = AuthUtils.decodeJwtAccessToken(res.cookies.accessToken.value);
        expect(accessToken.id).toBe(userId);
        expect(accessToken.provider).toBe('CREDENTIALS');
        expect(accessToken.providerKey).toBe('credentialsUser@mail.com');
        expect(accessToken.role).toBe('USER');
        expect(req.body.errors).toBeUndefined();
        expect(req.identity.id).toBe(userId);
        expect(req.identity.provider).toBe('CREDENTIALS');
        expect(req.identity.providerKey).toBe('credentialsUser@mail.com');
        expect(req.identity.role).toBe('USER');
    });
});

describe('userValidatorMW', () => {
    it('When role is different than USER then error message is returned', async () => {
        // Arrange:
        const req = Mocks.createRequest();
        req.identity = { role: 'USER' };
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        adminValidatorMW(req, res, next);

        // Assert:
        expect(next).not.toBeCalled();
        expect(res._getStatusCode()).toBe(401);
        expect(res._getJSONData().errors).toHaveLength(1);
        expect(res._getJSONData().errors[0].includes('admin role required'));
    });

    it('When everything is OK then next middleware is called', async () => {
        // Arrange:
        const req = Mocks.createRequest();
        req.identity = { role: 'USER' };
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        userValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalled();
        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toBe("");
    });
});

describe('ownerValidatorMW', () => {
    it('When role is different than OWNER then error message is returned', async () => {
        // Arrange:
        const req = Mocks.createRequest();
        req.identity = { role: 'USER' };
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        adminValidatorMW(req, res, next);

        // Assert:
        expect(next).not.toBeCalled();
        expect(res._getStatusCode()).toBe(401);
        expect(res._getJSONData().errors).toHaveLength(1);
        expect(res._getJSONData().errors[0].includes('owner role required'));
    });

    it('When everything is OK then next middleware is called', async () => {
        // Arrange:
        const req = Mocks.createRequest();
        req.identity = { role: 'OWNER' };
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        ownerValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalled();
        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toBe("");
    });
});

describe('adminValidatorMW', () => {
    it('When role is different than USER then error message is returned', async () => {
        // Arrange:
        const req = Mocks.createRequest();
        req.identity = { role: 'USER' };
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        adminValidatorMW(req, res, next);

        // Assert:
        expect(next).not.toBeCalled();
        expect(res._getStatusCode()).toBe(401);
        expect(res._getJSONData().errors).toHaveLength(1);
        expect(res._getJSONData().errors[0].includes('admin role required'));
    });

    it('When everything is OK then next middleware is called', async () => {
        // Arrange:
        const req = Mocks.createRequest();
        req.identity = { role: 'ADMIN' };
        const res = Mocks.createResponse();
        const next = jest.fn();

        // Act:
        adminValidatorMW(req, res, next);

        // Assert:
        expect(next).toBeCalled();
        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toBe("");
    });
});

afterAll(() => {
    mongoose.connection.close();
});