import http from 'http';
import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from "path";
import azure from 'azure-storage';
import socketio from 'socket.io';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { connectDb } from './db/utils';
import AuthRouter from './routers/AuthRouter';

require('dotenv').config();

connectDb();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

const server = http.createServer(app);

// ---  SOCKET  ----------------------------------------------------------------

let connectedUsers = {};

const io = socketio(server);
io.on('connection', socket => {
    socket.on('join', ({ email }) => {
        console.log(`${email} connected to the server`);

        connectedUsers[socket.id] = email;
        console.log('connected users:');
        console.log(connectedUsers);

        socket.emit('joinRes', "welcome to the server");
    });
    socket.on('disconnect', () => {
        console.log(`${connectedUsers[socket.id]} disconnected server`);
        
        delete connectedUsers[socket.id];
        console.log('connected users:');
        console.log(connectedUsers);
    });
});

// -----------------------------------------------------------------------------

app.post('/notify', async (req, res) => {
    const providerKey = req.body.providerKey;
    const key = Object.keys(connectedUsers).find(u => connectedUsers[u] === providerKey);
    io.to().sockets[key].emit('serverMessage', 'Notified!');
    res.json(key);
});

app.post('/upload', async (req, res) => {
    if (!req.files) return res.status(400).json({
        errors: ["No file uploaded"]
    });

    const file = req.files.file;
    const fileExt = path.extname(file.name);
    const generatedFilename = uuid() + fileExt;

    const blobService = azure.createBlobService();

    let blobOptions;
    if (ext === '.jpg' || ext === '.jpeg')
        blobOptions = { contentSettings: { contentType: 'image/jpeg' } }
    else if (ext === '.png')
        blobOptions = { contentSettings: { contentType: 'image/png' } };
    else return res.json({ errors: ['must be image type'] });

    blobService.createBlockBlobFromText('images', generatedFilename, file.data,
        blobOptions, err => { if (err) throw err; });

    return res.json(blobService.getUrl('images', generatedFilename));
});

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Hello world" });
});

app.use('/auth', AuthRouter);

app.get('*', (_req, res) => {
    res.sendStatus(404);
});

app.use((err, req, res) => {
    console.log(err)
    res.status(500).json({ errors: ['Internal error'] });
});

const port = process.env.PORT || 9000;
server.listen(port, () => {
    console.log(`Listening on ${port}...`);
});