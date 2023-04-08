/* eslint-disable import/no-extraneous-dependencies */
import morgan, { StreamOptions } from 'morgan';
import Logger from '@helpers/Logger';
import { IsProduction } from '@config/index';

const stream: StreamOptions = {
  write: (message) => Logger.http(message)
};

export default morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip: IsProduction }
);
