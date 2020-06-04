import types from './types';

export const setIdentity = identity => ({
    type: types.IDENTITY_SET, identity
});

export const unsetIdentity = () => ({
    type: types.IDENTITY_UNSET
});