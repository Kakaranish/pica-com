import http from 'http';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import moment from 'moment';
import configSocketIO from './socketio/config';
import SocketRepository from './socketio/SocketRepository';
import Notification from './db/models/Notification';
import { interserviceTokenValidatorMW } from './auth/validators';
import { connectDb } from './db/utils';

require('dotenv').config();

connectDb();

const socketRepository = new SocketRepository();

const app = express();
const server = http.createServer(app);
const io = configSocketIO(server, socketRepository);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/notify', interserviceTokenValidatorMW, async (req, res) => {
    const socketIds = socketRepository.getUserSocketIds(req.payload.identity.id);

    const notification = new Notification({
        userId: req.payload.identity.id,
        content: req.payload.content,
        createdAt: moment().toDate()
    });
    await notification.save();

    socketIds.forEach(socketId =>
        io.to().sockets[socketId].emit('notif', notification.toJSON()));
    res.json(socketIds);
});

app.post('/clear', interserviceTokenValidatorMW, async(req, res) => {
    const socketIds = socketRepository.getUserSocketIds(req.payload.identity.id);
    socketIds.forEach(socketId =>
        io.to().sockets[socketId].emit('clearNotifs'));
    res.json(socketIds);
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on ${port}...`));