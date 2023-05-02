import { IsProduction, logFilePath } from '@config/index';
import { addColors, format } from 'winston';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'green'
} as const;

const level = IsProduction() ? 'warn' : 'debug';

export const fileOptions: DailyRotateFileTransportOptions = {
  level,
  dirname: logFilePath,
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  handleExceptions: true,
  json: true,
  maxSize: '20m',
  maxFiles: '15d'
};

const formatLogMessage = format.printf(
  (info: any) => `[${info.timestamp} - ${info.level} ] ${info.message}`
);

addColors(colors);
export const consoleOptions: ConsoleTransportOptions = {
  level,
  format: format.combine(
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    format.colorize({ all: true }),
    format.timestamp(),
    formatLogMessage
  )
};
