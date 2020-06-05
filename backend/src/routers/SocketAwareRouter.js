import { Router } from 'express';

const createSocketAwareRouter = (io, connectedUsers) => {
    const router = Router();

    router.post('/notify', async (req, res) => {
        const providerKey = req.body.providerKey;
        const key = Object.keys(connectedUsers).find(u => connectedUsers[u] === providerKey);
        const socket = io.to().sockets[key];
        socket.emit('serverMessage', 'Notified!');
        res.json(key);
    });

    return router;
}

export default createSocketAwareRouter;