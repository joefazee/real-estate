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
      primaryKey: true,
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
  { tableName: 'user_categories', timestamps: false, underscored: true }
);

UserCategory.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
UserCategory.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

module.exports = UserCategory;
