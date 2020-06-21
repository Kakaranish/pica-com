import http from 'http';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import configSocketIO from './socketio/config';
import SocketRepository from './socketio/SocketRepository';
import Notification from './db/models/Notification';
import { interserviceTokenValidatorMW } from './auth/validators';
import { connectDb } from './db/utils';
import { withAsyncRequestHandler } from './common/utils';
import { createNotifyRouter } from './Routers/NotifyRouter';
import { createClearNotificationsRouter } from './Routers/ClearNotificationsRouter';

require('dotenv').config();

connectDb();

const socketRepository = new SocketRepository();

const app = express();
const server = http.createServer(app);
const io = configSocketIO(server, socketRepository);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/notify', createNotifyRouter(socketRepository, io));
app.use('/clear', createClearNotificationsRouter(socketRepository, io));

app.post('/notifications/user', interserviceTokenValidatorMW, async (req, res) => {
	withAsyncRequestHandler(res, async () => {
		const userId = req.payload.identity.id;
		const notifs = (await Notification.find({ userId })).map(notif => ({
			id: notif._id,
			header: notif.header,
			content: notif.content
		}));

		res.status(200).json(notifs);
	});
});

app.get('/healthcheck', (req, res) => res.status(200).json({ msg: 'Ok' }));

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening on ${port}...`));