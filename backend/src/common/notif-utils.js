import axios from "axios";
import { createInterserviceToken } from "../auth/utils";

require('dotenv').config();

/**
 * @param {Object} identity 
 * @param {String} identity.id 
 * @param {String} content notification content
 */
export const notifyToastOnly = async (identity, content) => {
    const payload = { identity, content };
    const interserviceToken = createInterserviceToken(payload);
    axios.post(`${process.env.NOTIF_SERVICE_URI}/notify/user/toast-only`,
        { interserviceToken });
};

/**
 * @param {Object} payload 
 * @param {Object} payload.identity
 * @param {String} payload.identity.id
 * @param {Object} payload.notification
 * @param {String} payload.notification.header
 * @param {String} payload.notification.content
 */
export const notify = async payload => {
    const interserviceToken = createInterserviceToken(payload);
    axios.post(`${process.env.NOTIF_SERVICE_URI}/notify/user`, { interserviceToken });
};

/**
 * @param {Object} payload 
 * @param {String} payload.eventId
 * @param {Object} payload.notification
 * @param {String} payload.notification.header
 * @param {String} payload.notification.content
 */
export const notifyAdmins = async payload => {
    const interserviceToken = createInterserviceToken(payload);
    const uri = `${process.env.NOTIF_SERVICE_URI}/notify/admins`;
    axios.post(uri, { interserviceToken }, { validateStatus: false });
};

/**
 * @param {String} eventId 
 */
export const clearNotifsForEvent = async eventId => {
    const payload = { eventId };
    const interserviceToken = createInterserviceToken(payload);
    const uri = `${process.env.NOTIF_SERVICE_URI}/clear/event`;
    axios.post(uri, { interserviceToken }, { validateStatus: false });
};