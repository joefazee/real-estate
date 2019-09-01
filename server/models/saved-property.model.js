const Sequelize = require('sequelize');

const sequelize = require('../config/database');
const tableName = 'saved_properties';

const SavedProperties = sequelize.define(
	'SavedProperty',
	{
		id: {
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false
		},
		property_id: {
			type: Sequelize.UUID,
			allowNull: false
		}
	},
	{ tableName, timestamps: false }
);

module.exports = SavedProperties;
