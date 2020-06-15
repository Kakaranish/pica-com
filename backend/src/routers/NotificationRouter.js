import express from 'express';
import axios from 'axios';
import { tokenValidatorMW } from '../auth/validators';
import { withAsyncRequestHandler } from '../common/utils';
import { createInterserviceToken } from '../auth/utils';

const NotificationRouter = express.Router();

NotificationRouter.get('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const payload = { identity: req.identity };
        const interserviceToken = createInterserviceToken(payload);
        
        const uri = 'http://localhost:8000/notifications/user';
        const result = await axios.post(uri, { interserviceToken });
        res.status(200).json(result.data);
    });
});

NotificationRouter.delete('/', tokenValidatorMW, async (req, res) => {
    withAsyncRequestHandler(res, async () => {
        const payload = { identity: req.identity };
        const interserviceToken = createInterserviceToken(payload);

        const uri = 'http://localhost:8000/clear/user';
        axios.post(uri, { interserviceToken }, { validateStatus: false });
        res.sendStatus(200);
    });
});

export default NotificationRouter;