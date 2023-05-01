import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import Logger from '@helpers/Logger';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { IsProduction, port } from '@config/index';
import Container from '@ioc/container';
import {
  customOrigin,
  globalErrorHandler,
  Morgan,
  shouldCompress
} from '@middlewares/index';
import { sequelize } from '@database/index';
import sync from '@database/sync';
import '@middlewares/notFoundHandler';
import '@controllers/AuthController';

// handle uncaughtException and exit the application with code 1.
process.on('uncaughtException', (err) => {
  Logger.error(`Uncaught Exception ${err}`);
  process.exit(1);
});

const expressApp = express();
expressApp.use(express.json());
expressApp.use((req, _, next) => {
  if (req.method.toUpperCase() !== 'GET' || !IsProduction)
    Logger.debug(req.body);
  next();
});
expressApp.use(Morgan);
expressApp.use(
  cors({
    origin: customOrigin,
    credentials: true,
    optionsSuccessStatus: 200
  })
);
expressApp.use(helmet());
expressApp.use(express.urlencoded({ extended: true, limit: '15mb' }));
expressApp.use(
  compression({
    level: 9,
    filter: shouldCompress
  })
);
const server = new InversifyExpressServer(
  Container,
  null,
  { rootPath: '/api' },
  expressApp
);
server.setErrorConfig((app) => app.use(globalErrorHandler));
const app = server.build();
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

const expServer = app.listen(port, () => {
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
