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
  shouldCompress,
  apiLimiter
} from '@middlewares/index';
import '@middlewares/notFoundHandler';
import '@controllers/AuthController';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as swagger from 'swagger-express-ts';
import { join } from 'path';
import '@apiModels/index';

const server = new InversifyExpressServer(Container, null, {
  rootPath: '/api'
});
server.setConfig((app: Application) => {
  app.use('/api-docs/', express.static(join(__dirname, '..', 'public')));
  app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
  app.use('/api', apiLimiter);
  app.use(express.json());
  app.use(swagger.express(
    {
      definition: {
        info: {
          title: 'CipherConvo',
          version: '1.0.0'
        },
        basePath: '/api',
        externalDocs: {
          url: 'localhost:3000/api-docs/'
        },
        securityDefinitions: {
          bearerAuth: {
            type: swagger.SwaggerDefinitionConstant.Security.Type.API_KEY,
            in: swagger.SwaggerDefinitionConstant.Security.In.HEADER,
            name: 'authorization'
          }
        }

      }
    }
  ));
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
