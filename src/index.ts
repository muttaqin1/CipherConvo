import { sequelize } from '@database/index';
import sync from '@database/sync';
import { port } from '@config/index';
import Logger from '@helpers/Logger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { customOrigin } from '@middlewares/cors';
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
    origin: customOrigin,
    credentials: true
  }
};
const io = new Server(server, options);
io.on('connection', () => {});

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
    Logger.info('Process terminated with SIGTERM signal.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  expServer.close(async () => {
    await sequelize.close();
    Logger.info('Process terminated with SIGINT signal.');
    process.exit(0);
  });
});
