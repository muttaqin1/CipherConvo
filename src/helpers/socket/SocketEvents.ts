import { Server } from 'socket.io';
import { UserSocket, HashMap } from '@auth/authorizeSocket';

export default class SocketEvents {
  constructor(
    public io: Server,
    public socket: UserSocket,
    public hashmap: HashMap
  ) {}

  public message(msg: string) {
    this.socket.emit('userMsg', msg);
  }
}
