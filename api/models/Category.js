const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: false
    }
  },
  { tableName: 'categories' }
);

module.exports = Category;
