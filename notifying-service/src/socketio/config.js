import cookie from 'cookie';
import socketio from 'socket.io';
import { decodeJwtAccessToken } from '../auth/utils';
import SocketRepository from './SocketRepository';

/**
 * @param {import("socket.io").Server} io 
 * @param {SocketRepository} socketRepository 
 */
const configSocketIO = (server, socketRepository) => {
    const io = socketio(server);
    io.on('connection', socket => {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        const identity = decodeJwtAccessToken(cookies.accessToken);
        if (!identity) return;

        socketRepository.add(socket.id, identity.id);

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