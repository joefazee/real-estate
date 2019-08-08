const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const AgencyProfile = require('../models/AgencyProfile');

const hooks = {
	beforeCreate(user) {
		user.password = bcryptService().hashPassword(user); // eslint-disable-line no-param-reassign
	},
};

const tableName = 'users';

const User = sequelize.define(
	'User',
	{
		//attributes
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		phone: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		user_type: {
			type: Sequelize.ENUM(['admin', 'investor', 'seller']),
			defaultValue: 'investor',
			allowNull: false,
		},
		email_verified: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
		},
	},
	{ hooks, tableName }
);

// eslint-disable-next-line
User.prototype.toJSON = function() {
	const values = Object.assign({}, this.get());

	delete values.password;

	return values;
};

User.hasOne(AgencyProfile, { as: 'profile', foreignKey: 'user_id' });

module.exports = User;
