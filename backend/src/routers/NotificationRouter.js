import express from 'express';
import axios from 'axios';
import { tokenValidatorMW } from '../auth/validators';
import Notification from '../db/models/Notification';
import { withAsyncRequestHandler } from '../common/utils';
import { createInterserviceToken } from '../auth/utils';

const NotificationRouter = express.Router();

NotificationRouter.get('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const notifs = await Notification.find({ userId: req.identity.id, isRead: false });
        res.status(200).json(notifs);
    });
});

NotificationRouter.delete('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        await Notification.updateMany({ userId: req.identity.id, isRead: false },
            { $set: { isRead: true } });

        const payload = { identity: req.identity };
        const interserviceToken = createInterserviceToken(payload);
        axios.post('http://localhost:8000/clear', { interserviceToken },
            { validateStatus: false });
        res.sendStatus(200);
    });
});

export default NotificationRouter;