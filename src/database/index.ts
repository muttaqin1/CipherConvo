import { Sequelize, Dialect } from 'sequelize';
import dbConfig from '@config/database';

// eslint-disable-next-line import/prefer-default-export
export const sequelize = new Sequelize({
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  port: dbConfig.PORT,
  database: dbConfig.database,
  dialect: dbConfig.DIALECT as Dialect,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
