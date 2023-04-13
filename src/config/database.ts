import {
  dialect,
  databaseName,
  databasePassword,
  databaseUser,
  databasePort
} from '.';

export default {
  USER: databaseUser, // database user name (if you have one)
  PASSWORD: databasePassword, // database password  (if you have one)
  DIALECT: dialect, // database dialect (mysql, postgres, sqlite, mssql)
  PORT: databasePort,
  database: databaseName, // database name
  // pool configuration used to pool database connections
  pool: {
    max: 5, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
  }
};
