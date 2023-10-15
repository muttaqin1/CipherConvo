import { Server } from 'socket.io';
import { UserSocket, SocketMap } from '@auth/authorizeSocket';

export default class SocketEvents {
  constructor(
    public io: Server,
    public socket: UserSocket,
    public hashmap: SocketMap
  ) {}

  public message(msg: string) {
    this.socket.emit('userMsg', msg);
  }
}
