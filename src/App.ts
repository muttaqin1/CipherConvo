import 'reflect-metadata';
import express, { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import Logger from '@helpers/Logger';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { IsProduction } from '@config/index';
import Container from '@ioc/container';
import {
  customOrigin,
  globalErrorHandler,
  Morgan,
  shouldCompress
} from '@middlewares/index';
import '@middlewares/notFoundHandler';
import '@controllers/AuthController';
import { apiLimiter } from '@middlewares/rateLimit';

const server = new InversifyExpressServer(Container, null, {
  rootPath: '/api'
});
server.setConfig((app: Application) => {
  app.use('/api', apiLimiter);
  app.use(express.json());
  app.use((req, _, next) => {
    if (req.method.toUpperCase() !== 'GET' || !IsProduction)
      Logger.debug(req.body);
    next();
  });
  app.use(Morgan);
  app.use(
    cors({
      origin: customOrigin,
      credentials: true,
      optionsSuccessStatus: 200
    })
  );
  app.use(helmet());
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(
    compression({
      level: 9,
      filter: shouldCompress
    })
  );
});
server.setErrorConfig((app) => app.use(globalErrorHandler));
const app = server.build();
export default app;
