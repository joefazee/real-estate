const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'agency_profile';

const AgencyProfile = sequelize.define(
	'AgencyProfile',
	{
		//attributes
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
		},
		user_id: {
			type: Sequelize.INTEGER,
			references: {
				model: 'users',
			},
		},
		business_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		business_address: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		website: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		phone: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		isApproved: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{ tableName }
);

module.exports = AgencyProfile;
