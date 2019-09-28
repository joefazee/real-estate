const Sequelize = require('sequelize');

const sequelize = require('../config/database');
const tableName = 'properties';

const Property = sequelize.define(
  'Property',
  {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    user_id: {
      type: Sequelize.UUID,
      references: {
        model: 'users'
      }
    },
    category_id: {
      type: Sequelize.UUID,
      references: {
        model: 'categories'
      }
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT('long'),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.STRING,//change to number
      allowNull: false
    },
    has_C_of_O: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    avg_monthly_payment: {
      type: Sequelize.STRING,
      allowNull: false
    },
    payment_duration: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM(['active', 'non_active']),
      defaultValue: 'non_active',
      allowNull: false
    },
    images: {
      type: Sequelize.TEXT('long'),//string separeted by commas
      allowNull: true
    }
  },
  { tableName }
);

module.exports = Property;
