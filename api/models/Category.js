const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const PropertyListing = require('../models/PropertyListing');

const tableName = 'categories';

const Category = sequelize.define(
	'Category',
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING(255),
			unique: true,
			allowNull: false,
		},
	},
	{ tableName, timestamps: false, underscored: true }
);

Category.hasMany(PropertyListing, { as: 'property', foreignKey: 'category_id' });

module.exports = Category;
