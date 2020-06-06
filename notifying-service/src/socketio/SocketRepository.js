/**
 * @classdesc In memory socket connection collection
 */
class SocketRepository {
    constructor() {
        this.socketConnections = {};
    }

    /**
     * @param {String} socketId 
     * @param {String} userId 
     */
    add(socketId, userId) {
        this.socketConnections[socketId] = userId;
    }

    getAll() {
        return this.socketConnections;
    }

    /**
     * @param {String} userId 
     */
    getUserSocketIds(userId) {
        return Object.keys(this.socketConnections)
            .filter(u => this.socketConnections[u] === userId);
    }

    /**
     * @param {String} socketId 
     */
    remove(socketId) {
        delete this.socketConnections[socketId];
    }

    /**
     * @param {String} userId 
     */
    removeForUser(userId) {
        this.getUserSocketIds(userId)
            .forEach(s => delete this.socketConnections[userId]);
    }
}

export default SocketRepository;