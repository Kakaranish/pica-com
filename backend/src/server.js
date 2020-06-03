import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import User from "./db/models/User";
import { connectDb } from './db/utils';
import AuthRouter from './routers/AuthRouter';

require('dotenv').config();

connectDb();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});