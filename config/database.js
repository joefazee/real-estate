const Sequelize = require('sequelize');
// const path = require('path');

const connection = require('./connection');

let database;

switch (process.env.NODE_ENV) {
	case 'production':
		database = new Sequelize(
			connection.production.database,
			connection.production.username,
			connection.production.password,
			{
				logging: false,
				host: connection.production.host,
				dialect: connection.production.dialect,
				pool: {
					max: 5,
					min: 0,
					idle: 10000
				}
			}
		);
		break;
	case 'testing':
		database = new Sequelize(
			connection.testing.database,
			connection.testing.username,
			connection.testing.password,
			{
				logging: false,
				host: connection.testing.host,
				dialect: connection.testing.dialect,
				pool: {
					max: 5,
					min: 0,
					idle: 10000
				}
			}
		);
		break;
	default:
		database = new Sequelize(
			connection.development.database,
			connection.development.username,
			connection.development.password,
			{
				logging: false,
				host: connection.development.host,
				port: connection.development.port,
				dialect: connection.development.dialect,
				dialectOptions: {
					useUTC: false,
					dateStrings: true,
					typeCast: true,
					timezone: '+01:00'
				},
				timezone: '+01:00',
				pool: {
					max: 5,
					min: 0,
					idle: 10000
				}
			}
		);
}

module.exports = database;
