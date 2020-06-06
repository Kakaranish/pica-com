import types from './types';

export const setNotifs = notifs => ({
    type: types.NOTIF_SET, notifs
});

export const addNotif = notif => ({
    type: types.NOTIF_ADD, notif
});

export const removeNotif = notifId => ({
    type: types.NOTIF_REMOVE, notifId
});

export const clearNotifs = () => ({
    type: types.NOTIF_CLEAR
});