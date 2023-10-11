import 'reflect-metadata';
import { sequelize } from '@database/index';
import sync from '@database/sync';
import { clientURL, port } from '@config/index';
import Logger from '@helpers/Logger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketHandler from '@helpers/socket/socketHandler';
import { authorizeSocket, UserSocket } from '@auth/authorizeSocket';
import App from './App';
// handle uncaughtException and exit the application with code 1.
process.on('uncaughtException', (err) => {
  Logger.error(`Uncaught Exception ${err}`);
  process.exit(1);
});
sequelize
  .authenticate({ logging: false })
  .then(() => {
    Logger.info('Database is connected');
    sync()
      .then(() => {
        Logger.info('Database is synced');
      })
      .catch((err) => {
        Logger.error('Unable to sync the database:', err);
      });
  })
  .catch((err) => {
    Logger.error('Unable to connect to the database:', err);
  });
const server = createServer(App);
const options = {
  cors: {
    origin: clientURL
  }
};
const io = new Server(server, options);
const socketMap = new Map<string, UserSocket>();
io.use(authorizeSocket(socketMap));
socketHandler(io, socketMap);

const expServer = server.listen(port, () => {
  Logger.info(`Server is running on port ${port}`);
});
// handle unhandledRejection and exit the application with code 1.
process.on('unhandledRejection', (err) => {
  Logger.error(`Unhandled Rejection ${err}`);
  process.exit(1);
});

// handle graceful shutdown of the application and close the database connection.
process.on('SIGTERM', () => {
  expServer.close(async () => {
    await sequelize.close();
    Logger.info('PROCESS TERMINATED WITH SIGTERM SIGNAL');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  expServer.close(async () => {
    await sequelize.close();
    Logger.info('PROCESS TERMINATED WITH SIGINT SIGNAL');
    process.exit(0);
  });
});
