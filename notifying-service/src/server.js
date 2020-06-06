import http from 'http';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { interserviceTokenValidatorMW } from './auth/validators';
import configSocketIO from './socketio/socketio-config';
import SocketRepository from './socketio/SocketRepository';

require('dotenv').config();

const socketRepository = new SocketRepository();

const app = express();
const server = http.createServer(app);
const io = configSocketIO(server, socketRepository);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/notify', interserviceTokenValidatorMW, async (req, res) => {
    const socketIds = socketRepository.getUserSocketIds(req.payload.identity.id);
    socketIds.forEach(socketId =>
        io.to().sockets[socketId].emit('serverMessage', 'Notified!'));
    res.json(socketIds);
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on ${port}...`));