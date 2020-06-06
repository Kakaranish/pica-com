import express from 'express';
import { tokenValidatorMW } from '../auth/validators';
import Notification from '../db/models/Notification';
import { withAsyncRequestHandler } from '../common/utils';

const NotificationRouter = express.Router();

NotificationRouter.get('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const notifs = await Notification.find({ userId: req.identity.id, isRead: false });
        res.status(200).json(notifs);
    });
});

NotificationRouter.post('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        await Notification.updateMany({ userId: req.identity.id, isRead: false },
            { $set: { isRead: true } });
        res.sendStatus(200);
    });
});

export default NotificationRouter;