import types from './types';

const notifReducer = (state = [], action) => {
    switch (action.type) {
        case types.NOTIF_SET:
            return action.notifs;
        case types.NOTIF_ADD:
            return [...state, action.notif];
        case types.NOTIF_REMOVE:
            return state.filter(n => n.id !== action.notifId);
        case types.NOTIF_CLEAR:
            return [];
        default:
            return state;
    }
};

export default notifReducer;