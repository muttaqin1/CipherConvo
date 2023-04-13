import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import Logger from '@helpers/Logger';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { IsProduction } from '@config/index';
import Container from '@config/container';
import {
  customOrigin,
  globalErrorHandler,
  Morgan,
  shouldCompress
} from '@middlewares/index';
import { sequelize } from '@database/index';

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
sequelize.authenticate({ logging: false }).then(() => {
  Logger.info('Database is connected');
  sequelize.sync({ force: false, logging: false }).then(() => {
    Logger.info('Database is synced');
  });
});
app.listen(3000, () => {
  Logger.info('Server is running on port 3000');
});
