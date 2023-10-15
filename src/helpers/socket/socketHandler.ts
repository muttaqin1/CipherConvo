import { Server } from 'socket.io';
import SocketEvents from '@helpers/socket/SocketEvents';
import { UserSocket, SocketMap } from '@auth/authorizeSocket';

export default (io: Server, socketMap: SocketMap) => {
  io.on('connection', (socket) => {
    const userSocket = socket as UserSocket;
    const socketEvents = new SocketEvents(io, userSocket, socketMap);
    userSocket.on('userMsg', socketEvents.message);

    userSocket.on('disconnect', () => socketMap.delete(userSocket.userId));
  });
};
