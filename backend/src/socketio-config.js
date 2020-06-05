import cookie from 'cookie';
import { decodeJwtAccessToken, decodeJwtRefreshToken } from './auth/utils';

/**
 * @param {import("socket.io").Server} io 
 * @param {import("socket.io").Socket} socket 
 * @param {Array} connectedUsers 
 */
export const config = (io, socket, connectedUsers) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    const identity = decodeJwtAccessToken(cookies.accessToken);
    connectedUsers[socket.id] = identity.userId;
    socket.emit('joinRes', "welcome to the server");

    console.log(`${identity.provider}:${identity.providerKey} connected to the server`);
    logConnectedUsers(connectedUsers);

    socket.on('disconnect', () => {
        delete connectedUsers[socket.id];
        
        console.log(`${identity.provider}:${identity.providerKey} disconnected server`);
        logConnectedUsers(connectedUsers)
    });
};

const logConnectedUsers = connectedUsers => {
    console.log('connected users:');
    console.log(connectedUsers);
}