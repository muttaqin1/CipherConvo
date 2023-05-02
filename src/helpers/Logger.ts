import { fileOptions, consoleOptions } from '@config/logger';
import { createLogger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const fileTransport = new DailyRotateFile(fileOptions);
const consoleTransport = new transports.Console(consoleOptions);

export default createLogger({
  transports: [consoleTransport, fileTransport],
  exceptionHandlers: [fileTransport],
  exitOnError: false
});
