import types from './types';

const identityReducer = (state = null, action) => {
    switch (action.type) {
        case types.IDENTITY_SET:
            return {
                email: action.identity.email,
                provider: action.identity.provider,
                firstName: action.identity.firstName,
                lastName: action.identity.lastName,
                role: action.identity.role,
            };
        case types.IDENTITY_UNSET:
            return null;
        default:
            return state;
    }
};

export default identityReducer;