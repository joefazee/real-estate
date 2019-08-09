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
      allowNull: false,
      references: {
        model: User,
        key: 'user_id'
      }
    },
    category_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      references: {
        model: Category,
        key: 'category_id'
      }
    }
  },
  { tableName: 'user_categories', timestamps: false, underscored: true }
);

UserCategory.belongsTo(User, { as: 'user', foreignKey: 'id' });
UserCategory.belongsTo(Category, { as: 'category', foreignKey: 'id' });

module.exports = UserCategory;
