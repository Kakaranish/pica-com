import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import axios from 'axios';
import { connectDb, initRootUser } from './db/utils';
import { createInterserviceToken } from './auth/utils';
import { tokenValidatorMW } from './auth/validators';
import AuthRouter from './routers/AuthRouter';
import NotificationRouter from "./routers/NotificationRouter";
import AdminRouter from "./routers/AdminRouter";
import AccountRouter from "./routers/AccountRouter";
import RestaurantRouter from "./routers/RestaurantRouter";
import PizzaRouter from "./routers/PizzaRouter";
import ExtraIngredientRouter from "./routers/ExtraIngredientRouter";

require('dotenv').config();

connectDb();
initRootUser();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

app.use('/auth', AuthRouter);
app.use('/notifications', NotificationRouter);
app.use('/admin', AdminRouter);
app.use('/account', AccountRouter);
app.use('/restaurants', RestaurantRouter);
app.use('/pizza', PizzaRouter);
app.use('/extra-ingredient', ExtraIngredientRouter);

app.post('/notify', tokenValidatorMW, async (req, res) => {
    const payload = {
        identity: req.identity,
        content: req.body.content
    }
    const interserviceToken = createInterserviceToken(payload);
    axios.post('http://localhost:8000/notify', { interserviceToken });
    res.sendStatus(200);
});

app.get('/', (_req, res) => res.status(200).json({ msg: "Hello world" }));

app.get('*', (_req, res) => res.sendStatus(404));

app.use((err, req, res) => {
    console.log(err)
    res.status(500).json({ errors: ['Internal error'] });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});