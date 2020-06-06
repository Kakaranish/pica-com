import mongoose from 'mongoose';
import { connectTestDb } from '../../src/db/utils';
import RefreshToken from '../../src/db/models/RefreshToken';
import User from '../../src/db/models/User';
import * as AuthUtils from '../../src/auth/utils';
import * as TestUtils from '../test-utils';

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

describe('createAccessToken', () => {
    it('When user is null/undefined then null is returned', () => {
        // Act:
        const result = AuthUtils.createAccessToken(null);

        // Assert:
        expect(result).toBeNull();
    });

    it('When everything is OK then jwt token is returned', () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }

        // Act:
        const result = AuthUtils.createAccessToken(identity);

        // Assert:
        const decodedResult = AuthUtils.decodeJwtAccessToken(result);
        expect(decodedResult.id).toBe(anyUserId);
        expect(decodedResult.provider).toBe('CREDENTIALS');
        expect(decodedResult.providerKey).toBe('user@mail.com');
        expect(decodedResult.role).toBe('USER');
    });
});

describe('createRefreshToken', () => {
    it('When user is null/undefined then null is returned', async () => {
        // Act:
        const result = await AuthUtils.createRefreshToken(null);

        // Assert: 
        expect(result).toBeNull();
    });

    it('When userId is not valid ObjectId then null is returned', async () => {
        // Arrange:
        const anyUserId = 'asdasdas';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }

        // Act:
        const result = await AuthUtils.createRefreshToken(identity);

        // Assert: 
        expect(result).toBeNull();
    });

    it('When everything is OK then token is saved in db and jwt is returned', async () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        await RefreshToken.deleteOne({ userId: anyUserId });

        // Act:
        const result = await AuthUtils.createRefreshToken(identity);

        // Assert:
        let refreshTokenDoc;
        try {
            refreshTokenDoc = await RefreshToken.findOne({ userId: identity.id });
            expect(refreshTokenDoc).not.toBeNull();
            expect(result).toBe(refreshTokenDoc.token);
            const decodedResult = AuthUtils.decodeJwtRefreshToken(result);
            expect(decodedResult.id).toBe(anyUserId);
            expect(decodedResult.provider).toBe('CREDENTIALS');
            expect(decodedResult.providerKey).toBe('user@mail.com');
            expect(decodedResult.role).toBe('USER');
        } catch (error) {
            throw error
        } finally {
            if (refreshTokenDoc) await refreshTokenDoc.remove();
        }
    });
});


describe('refreshAccessToken', () => {
    it('When refresh token cant be decoded then null is returned', async () => {
        // Arrange:
        const jwtRefreshToken = 'MALFORMED';

        // Act:
        const result = await AuthUtils.refreshAccessToken(jwtRefreshToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When user id inside token is invalid then null is returned', async () => {
        // Arrange:
        const anyUserId = 'asdasdas';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtRefreshToken = TestUtils.createTestRefreshToken(identity);

        // Act:
        const result = await AuthUtils.refreshAccessToken(jwtRefreshToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When token does not exist in db then null is returned', async () => {
        // Arrange:
        const anyUserId = '5eb3fc74fc3be2520994fa52';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtRefreshToken = TestUtils.createTestRefreshToken(identity);

        // Act:
        const result = await AuthUtils.refreshAccessToken(jwtRefreshToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When everything is ok then refreshed access token is returned', async () => {
        // Arrange:
        const jwtRefreshToken = refreshToken.token;

        // Act:
        const result = await AuthUtils.refreshAccessToken(jwtRefreshToken);

        // Arrange:
        const decodedResult = AuthUtils.decodeJwtAccessToken(result);
        expect(decodedResult.id).toBe(userId);
        expect(decodedResult.provider).toBe('CREDENTIALS');
        expect(decodedResult.providerKey).toBe('credentialsUser@mail.com');
        expect(decodedResult.role).toBe('USER');
    });
});

describe('decodeJwtAccessToken', () => {
    it('When jwt access token is malformed then null is returned', () => {
        // Arrange:
        const jwtAccessToken = 'MALFORMED_BLAH_BLAH';

        // Act:
        const result = AuthUtils.decodeJwtAccessToken(jwtAccessToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When jwt access token is expired then null is returned', () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtAccessToken = TestUtils.createTestAccessToken(identity, 1);

        // Act:
        const result = AuthUtils.decodeJwtAccessToken(jwtAccessToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When access token does not match jwt secret then null is returned', () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtAccessToken = TestUtils.createTestAccessToken(identity, 10 * 1000, 'any_secret');

        // Act:
        const result = AuthUtils.decodeJwtAccessToken(jwtAccessToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When access token is valid then it decoded token is returned', () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtAccessToken = TestUtils.createTestAccessToken(identity, 10 * 1000);

        // Act:
        const result = AuthUtils.decodeJwtAccessToken(jwtAccessToken);

        // Assert:
        expect(result.id).toBe(anyUserId);
        expect(result.provider).toBe('CREDENTIALS');
        expect(result.providerKey).toBe('user@mail.com');
        expect(result.role).toBe('USER');
    });
});

describe('decodeJwtRefreshToken', () => {
    it('When jwt refresh token is malformed then null is returned', async () => {
        // Arrange:
        const jwtRefreshToken = 'MALFORMED_BLAH_BLAH';

        // Act:
        const result = AuthUtils.decodeJwtRefreshToken(jwtRefreshToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When refresh token does not match jwt secret then null is returned', async () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtRefreshToken = TestUtils.createTestRefreshToken(identity, 'SOME_SECRET');

        // Act:
        const result = AuthUtils.decodeJwtRefreshToken(jwtRefreshToken);

        // Assert:
        expect(result).toBeNull();
    });

    it('When everything is ok then decoded token is returned', async () => {
        // Arrange:
        const anyUserId = '5eb3f0e35e2995725d516219';
        const identity = {
            id: anyUserId,
            provider: 'CREDENTIALS',
            providerKey: 'user@mail.com',
            role: 'USER'
        }
        const jwtRefreshToken = TestUtils.createTestRefreshToken(identity);

        // Act:
        const result = AuthUtils.decodeJwtRefreshToken(jwtRefreshToken);

        // Assert:
        expect(result.id).toBe(anyUserId);
        expect(result.provider).toBe('CREDENTIALS');
        expect(result.providerKey).toBe('user@mail.com');
        expect(result.role).toBe('USER');
    });
});

afterAll(() => {
    mongoose.connection.close();
});