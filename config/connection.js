require('dotenv').config();

const development = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT
};

const testing = {
  database: 'databasename',
  username: 'username',
  password: 'password',
  host: 'localhost',
  dialect: 'sqlite'
};

const production = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql'
};

module.exports = {
  development,
  testing,
  production
};
