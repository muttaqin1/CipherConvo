import { Server } from 'socket.io';
import SocketEvents from '@helpers/socket/SocketEvents';
import { UserSocket, HashMap } from '@auth/authorizeSocket';

export default (io: Server, hashmap: HashMap) => {
  io.on('connection', (socket) => {
    const userSocket = socket as UserSocket;
    const socketEvents = new SocketEvents(io, userSocket, hashmap);
    userSocket.on('userMsg', socketEvents.message);

    userSocket.on('disconnect', () => hashmap.delete(userSocket.userId));
  });
};
