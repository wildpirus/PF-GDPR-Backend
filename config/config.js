require('dotenv').config();
var fs = require('fs');

const config = {
  port: process.env.PORT || 3000,
  cors: process.env.CORS,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbSslMode: process.env.DB_SSLMODE,
  dbServerCa: [fs.readFileSync(process.env.DB_SERVERCAPATH, "utf8")],
  dbName: process.env.DB_NAME
};

module.exports = { config };
