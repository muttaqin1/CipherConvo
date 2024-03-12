require('ts-node/register');
const { default: dbConfig } = require('../config/database');

module.exports = {
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.database,
  host: dbConfig.host,
  dialect: dbConfig.DIALECT
};
