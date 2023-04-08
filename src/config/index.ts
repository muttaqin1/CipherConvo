import { join } from 'path';

export const port = Number(process.env.PORT) || 3000;
export const environment = process.env.NODE_ENV || 'DEVELOPMENT';
export const IsProduction = (): boolean =>
  environment.toUpperCase() === 'PRODUCTION';
export const logFilePath = join(__dirname, '../../logs');
export const keyDirPath = join(__dirname, '../../keys');
export const passwordHashSaltRound =
  Number(process.env.PASSWORD_HASH_SALT_ROUND) || 11;
export const databaseHost = process.env.DATABASE_HOST || 'localhost';
export const databaseName = process.env.DATABASE_NAME || 'mysql';
export const databaseUser = process.env.DATABASE_USER || 'root';
export const databasePassword = process.env.DATABASE_PASSWORD || '11111111';
export const database = process.env.DATABASE || 'chat-application';
