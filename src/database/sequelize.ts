import { Sequelize } from 'sequelize';
import dbConfig from '../config/database';

let connection: Sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.host,
    dialect: 'mysql'
  }
);

export default connection;
