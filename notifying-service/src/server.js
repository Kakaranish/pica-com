import http from 'http';
import express from "express";
import cors from 'cors';
import socketio from 'socket.io';
import bodyParser from 'body-parser';
import { interserviceTokenValidatorMW } from './auth-utils';

require('dotenv').config();

const connectedUsers = [];

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/notify', interserviceTokenValidatorMW, async (req, res) => {
    const identityId = req.payload.identity.id;
    const keys = Object.keys(connectedUsers)
        .filter(u => connectedUsers[u] === identityId);
    keys.forEach(key => io.to().sockets[key].emit('serverMessage', 'Notified!'));
    res.json(keys);
});

io.on('connection', socket =>
    require('./socketio-config').config(io, socket, connectedUsers));

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on ${port}...`));