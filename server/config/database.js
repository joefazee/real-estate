const Sequelize = require("sequelize");
const {
  database: { dbName, dbPassword, dbHost, dbPort, dbUsername, dbDialect },
  env
} = require("./");

let database;

switch (env) {
  case "production":
    database = new Sequelize(dbName, dbUsername, dbPassword, {
      logging: false,
      host: dbHost,
      dialect: dbDialect,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });
    break;
  case "testing":
    database = new Sequelize("database", "username", "password", {
      logging: false,
      host: "localhost",
      dialect: "sqlite",
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });
    break;
  default:
    database = new Sequelize(dbName, dbUsername, dbPassword, {
      logging: false,
      host: dbHost,
      port: dbPort,
      dialect: dbDialect,
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: "+01:00",
        multipleStatements: true
      },
      timezone: "+01:00",
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });
}

module.exports = database;
