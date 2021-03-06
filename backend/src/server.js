import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { connectDb, initRootUser } from './db/utils';
import { notify } from "./common/notif-utils";
import { tokenValidatorMW } from './auth/validators';
import AuthRouter from './routers/AuthRouter';
import NotificationRouter from "./routers/NotificationRouter";
import AdminRouter from "./routers/Admin/AdminRouter";
import AccountRouter from "./routers/AccountRouter";
import OwnerRouter from './routers/Owner/OwnerRouter';
import MiscRouter from "./routers/MiscRouter";
import RestaurantsRouter from "./routers/RestaurantsRouter";
import OrdersRouter from "./routers/OrdersRouter";
require('dotenv').config();

connectDb();
initRootUser();

const app = express();

console.log(process.env.NODE_ENV)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URI }));

app.use('/', MiscRouter);
app.use('/auth', AuthRouter);
app.use('/admin', AdminRouter);
app.use('/account', AccountRouter);
app.use('/owner', OwnerRouter);
app.use('/notifications', NotificationRouter);

app.use('/restaurants', RestaurantsRouter);
app.use('/orders', OrdersRouter);

app.use('/restaurants', RestaurantsRouter);

// TODO: It's temp. To remove in the future
app.post('/notify', tokenValidatorMW, async (req, res) => {
    notify({
        identity: req.identity,
        notification: {
            header: 'backend /notify',
            content: req.body.content
        }
    });
    res.sendStatus(200);
});

app.get('/', (_req, res) => res.status(200).json({ msg: "Ok" }));

app.get('*', (_req, res) => res.sendStatus(404));

app.use((err, req, res) => {
    console.log(err)
    res.status(500).json({ errors: ['Internal error'] });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});