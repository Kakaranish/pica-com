import http from 'http';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import configSocketIO from './socketio/config';
import SocketRepository from './socketio/SocketRepository';
import Notification from './db/models/Notification';
import { interserviceTokenValidatorMW } from './auth/validators';
import { connectDb } from './db/utils';
import SimplifiedUser from './db/models/SimplifiedUser';
import { withAsyncRequestHandler } from './common/utils';


require('dotenv').config();

connectDb();

const socketRepository = new SocketRepository();

const app = express();
const server = http.createServer(app);
const io = configSocketIO(server, socketRepository);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// CHANGE TO GET
app.post('/notifications/user', interserviceTokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const userId = req.payload.identity.id;
        const notifs = await Notification.find({ userId });
        res.status(200).json(notifs);
    });
});

app.post('/notify/admins', interserviceTokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const adminIds = (await SimplifiedUser.find({ role: 'ADMIN' })
            .select('id')).map(admin => admin._id);
        adminIds.forEach(async adminId => {
            const socketIds = socketRepository.getUserSocketIds(adminId);

            const notification = new Notification({
                userId: adminId,
                eventId: req.payload.eventId,
                content: req.payload.notification.content,
                header: req.payload.notification.header
            });
            socketIds.forEach(socketId =>
                io.to().sockets[socketId].emit('notif', notification.toJSON()));
            await notification.save();
        });
    });
});

app.post('/notify/user/toast-only', interserviceTokenValidatorMW,
    async (req, res) => {
        withAsyncRequestHandler(res, async () => {
            const socketIds = socketRepository.getUserSocketIds(
                req.payload.identity.id);
            socketIds.forEach(socketId => io.to().sockets[socketId]
                .emit('toastOnlyNotif', req.payload.content));
        });
    }
);

app.post('/notify', interserviceTokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const socketIds = socketRepository.getUserSocketIds(req.payload.identity.id);

        const notification = new Notification({
            userId: req.payload.identity.id,
            header: req.payload.notification.header,
            content: req.payload.notification.content
        });
        await notification.save();

        socketIds.forEach(socketId =>
            io.to().sockets[socketId].emit('notif', notification.toObject()));
        res.json(socketIds);
    });
});

app.post('/clear/event', interserviceTokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const eventId = req.payload.eventId;
        const notifs = await Notification.find({ eventId: eventId });
        notifs.forEach(notif => {
            const socketIds = socketRepository.getUserSocketIds(notif.userId);
            socketIds.forEach(socketId => io.to().sockets[socketId]
                .emit('clearNotifs', { notifId: notif._id }));
        });
        await Notification.deleteMany({ eventId: eventId });
    });
});

app.post('/clear/user', interserviceTokenValidatorMW, async (req, res) => {
    await Notification.deleteMany({ userId: req.payload.identity.id });
    const socketIds = socketRepository.getUserSocketIds(req.payload.identity.id);
    socketIds.forEach(socketId =>
        io.to().sockets[socketId].emit('clearNotifs'));
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on ${port}...`));