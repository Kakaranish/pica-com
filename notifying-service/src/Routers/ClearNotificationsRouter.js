import express from 'express';
import { withAsyncRequestHandler } from '../common/utils';
import { interserviceTokenValidatorMW } from '../auth/validators';
import Notification from '../db/models/Notification';

export const createClearNotificationsRouter = (socketRepository, io) => {

    const ClearNotificationsRouter = express.Router();

    ClearNotificationsRouter.post('/event', interserviceTokenValidatorMW,
        async (req, res) => {
            withAsyncRequestHandler(res, async () => {
                const eventId = req.payload.eventId;
                const notifs = await Notification.find({ eventId: eventId });
                notifs.forEach(notif => {
                    const socketIds = socketRepository.getUserSocketIds(notif.userId);
                    socketIds.forEach(socketId => io.to().sockets[socketId]
                        .emit('removeNotif', { notifId: notif._id }));
                });
                await Notification.deleteMany({ eventId: eventId });
            });
        }
    );

    ClearNotificationsRouter.post('/user', interserviceTokenValidatorMW,
        async (req, res) => {
            withAsyncRequestHandler(res, async () => {
                await Notification.deleteMany({ userId: req.payload.identity.id });
                const socketIds = socketRepository.getUserSocketIds(
                    req.payload.identity.id);
                socketIds.forEach(socketId =>
                    io.to().sockets[socketId].emit('clearNotifs'));
            });
        }
    );

    return ClearNotificationsRouter;
};