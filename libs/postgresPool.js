const { Pool } = require('pg');
const { config } = require('../config/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const pool = new Pool({
  /*host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  user: encodeURIComponent(config.dbUser),
  password: encodeURIComponent(config.dbPassword),*/
  connectionString: URI,
  sslmode: config.dbSslMode,
  ssl: {
    rejectUnauthorized: true,
    ca: config.dbServerCa
  }
});

module.exports = pool;
