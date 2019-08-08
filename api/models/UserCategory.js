const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const Category = require('./Category');
const User = require('./User');

const UserCategory = sequelize.define(
  'UserCategory',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    category_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    }
  },
  { tableName: 'user_categories' }
);

UserCategory.hasOne(User);

UserCategory.hasMany(Category);

module.exports = UserCategory;
