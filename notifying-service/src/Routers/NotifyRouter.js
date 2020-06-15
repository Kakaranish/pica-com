import express from 'express';
import { withAsyncRequestHandler } from '../common/utils';
import { interserviceTokenValidatorMW } from '../auth/validators';
import Notification from '../db/models/Notification';
import SimplifiedUser from '../db/models/SimplifiedUser';

export const createNotifyRouter = (socketRepository, io) => {

    const NotifyRouter = express.Router();

    NotifyRouter.post('/user', interserviceTokenValidatorMW, async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const socketIds = socketRepository.getUserSocketIds(
                req.payload.identity.id);

            const notification = new Notification({
                userId: req.payload.identity.id,
                header: req.payload.notification.header,
                content: req.payload.notification.content
            });
            await notification.save();

            socketIds.forEach(socketId => io.to().sockets[socketId]
                .emit('notif', notification.toNotifJson()));
            res.json(socketIds);
        });
    });

    NotifyRouter.post('/user/toast-only', interserviceTokenValidatorMW,
        async (req, res) => {
            withAsyncRequestHandler(res, async () => {
                const socketIds = socketRepository.getUserSocketIds(
                    req.payload.identity.id);
                socketIds.forEach(socketId => io.to().sockets[socketId]
                    .emit('toastOnlyNotif', req.payload.content));
            });
        }
    );

    NotifyRouter.post('/admins', interserviceTokenValidatorMW, async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const adminIds = (await SimplifiedUser.find({ role: 'ADMIN' })
                .select('id')).map(admin => admin._id);

            adminIds.forEach(async id => {
                const socketIds = socketRepository.getUserSocketIds(id);
                const notification = new Notification({
                    userId: id,
                    eventId: req.payload.eventId,
                    content: req.payload.notification.content,
                    header: req.payload.notification.header
                });
                await notification.save();

                socketIds.forEach(socketId => io.to().sockets[socketId]
                    .emit('notif', notification.toNotifJson()));
            });
        });
    });

    return NotifyRouter;
};