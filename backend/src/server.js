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

app.use(async (_req, res) => {
    console.log('Error: Unknown internal error');
    if (res) res.status(500).json({ errors: ['Internal error'] });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});