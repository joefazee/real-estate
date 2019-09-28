const Sequelize = require('sequelize');

const sequelize = require('../config/database');
const tableName = 'property_images';

const PropertyImage = sequelize.define('PropertyImage', {
	id: {
		primaryKey: true,
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
	},
	link: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	property_id: {
		type: Sequelize.UUID,
		allowNull: false,
	},
}, {tableName, timestamps: false});

module.exports = PropertyImage;