const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const UserCategories = sequelize.define(
  'UserCategories',
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

module.exports = UserCategories;
