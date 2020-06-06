import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from "path";
import azure from 'azure-storage';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { connectDb } from './db/utils';
import AuthRouter from './routers/AuthRouter';
import axios from 'axios';
import { createInterserviceToken } from './auth/utils';
import { tokenValidatorMW } from './auth/validators';

require('dotenv').config();

connectDb();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

app.use('/auth', AuthRouter);

app.post('/buy', tokenValidatorMW, async (req, res) => {
    const interserviceToken = createInterserviceToken({ identity: req.identity });
    axios.post('http://localhost:8000/notify', { interserviceToken });
    res.sendStatus(200);
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
    if (fileExt === '.jpg' || fileExt === '.jpeg')
        blobOptions = { contentSettings: { contentType: 'image/jpeg' } }
    else if (fileExt === '.png')
        blobOptions = { contentSettings: { contentType: 'image/png' } };
    else return res.json({ errors: ['must be image type'] });

    blobService.createBlockBlobFromText('images', generatedFilename, file.data,
        blobOptions, err => { if (err) throw err; });

    return res.json(blobService.getUrl('images', generatedFilename));
});

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Hello world" });
});

app.get('*', (_req, res) => {
    res.sendStatus(404);
});

app.use((err, req, res) => {
    console.log(err)
    res.status(500).json({ errors: ['Internal error'] });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});