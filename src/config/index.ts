import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: join(__dirname, '../../.env') });

export const port = Number(process.env.PORT) || 3000;
export const environment = process.env.NODE_ENV || 'DEVELOPMENT';
export const IsProduction = (): boolean =>
  environment.toUpperCase() === 'PRODUCTION';
export const logFilePath = join(__dirname, '../../logs');
export const keyDirPath = join(__dirname, '../../keys');
export const passwordHashSaltRound =
  Number(process.env.PASSWORD_HASH_SALT_ROUND) || 11;
export const databaseUser = process.env.DATABASE_USER || 'root';
export const databasePort = Number(process.env.DATABASE_PORT) || 3306;
export const databasePassword = process.env.DATABASE_PASSWORD || '11111111';
export const dialect = process.env.DATABASE_DIALECT || 'mysql';
export const databaseName = process.env.DATABASE_NAME || 'chat_application';
export const JWT = {
  aud: process.env.JWT_AUD || 'audience',
  sub: process.env.JWT_SUB || 'subject',
  iss: process.env.JWT_ISS || 'issuer.com',
  accessTokenExpiry:
    Number(process.env.JWT_ACCESS_TOKEN_EXPIRY) || 1000 * 60 * 10,
  refreshTokenExpiry:
    Number(process.env.JWT_REFRESH_TOKEN_EXPIRY) || 1000 * 60 * 60 * 24 * 30
} as const;
export const corsURL = process.env.CORS_URL || 'http://localhost:3000';
export const smtp = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  email: process.env.SMTP_EMAIL || null,
  password: process.env.SMTP_PASSWORD || null
};
export const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
