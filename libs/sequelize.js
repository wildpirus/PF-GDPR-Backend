const { Sequelize } = require('sequelize');

const { config } = require('../config/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  dialectOptions: {
    sslmode: config.dbSslMode,
    ssl: {
      rejectUnauthorized: true,
      ca: config.dbServerCa
    }
  },
  logging: true
});

module.exports = sequelize;
