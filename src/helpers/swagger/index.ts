import swaggerUi from 'swagger-ui-express';
import path from 'path';
import yaml from 'yamljs';
import { Application } from 'express';
import { mergeYamlFiles } from '@helpers/swagger/mergeYamlFiles';
import { IsProduction, port } from '@config/index';
import Logger from '@helpers/Logger';

// Path to the swagger annotations directory
const docsDirPath = path.join(__dirname, '../../../docs');
// Path to the swagger.yaml file
const swaggerSpecPath = path.join(__dirname, '../../../swagger.yaml');
// Load the swagger.yaml file
const swaggerSpec = yaml.load(swaggerSpecPath);
// Merge the swagger.yaml file with the swagger annotations
swaggerSpec.paths = mergeYamlFiles(docsDirPath);

export default (app: Application): void => {
  if (IsProduction()) return;
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Get docs in JSON format
  app.get('/docs-json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  Logger.info(`Swagger docs available at http://localhost:${port}/docs`);
  Logger.info(
    `Swagger docs in JSON format available at http://localhost:${port}/docs-json`
  );
};
