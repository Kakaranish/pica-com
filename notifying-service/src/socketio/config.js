import socketio from 'socket.io';
import { decodeNotifIdentityToken } from '../auth/utils';
import SocketRepository from './SocketRepository';

/**
 * @param {import("socket.io").Server} io 
 * @param {SocketRepository} socketRepository 
 */
const configSocketIO = (server, socketRepository) => {
    const io = socketio(server);
    io.on('connection', socket => {
        const identityToken = socket.handshake.query.notifIdentityToken;
        const userId = decodeNotifIdentityToken(identityToken)?.userId;
        if (!userId) return;

        socketRepository.add(socket.id, userId);

        logConnectedUsers(socketRepository);

        socket.on('disconnect', () => {
            socketRepository.remove(socket.id);
            logConnectedUsers(socketRepository)
        });
    });

    return io;
}

const logConnectedUsers = socketRespository => {
    console.log('connected users:');
    console.log(socketRespository.getAll());
}

export default configSocketIO;