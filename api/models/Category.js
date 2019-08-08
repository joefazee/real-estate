const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'categories';

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: false
    }
  },
  { tableName }
);

module.exports = Category;
