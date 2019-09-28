require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const bcryptService = require('../services/bcrypt.service');
const AgencyProfile = require('./agency-profile.model');
const UserCategory = require('./user-category.model');
const PropertyListing = require('./property.model');
const SavedProperties = require('./saved-property.model');

const hooks = {
  async beforeCreate(user) {
    user.password = await bcryptService.hashPassword(user);
  }
};

const tableName = 'users';

const User = sequelize.define(
  'User',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_type: {
      type: Sequelize.ENUM(['admin', 'investor', 'seller']),
      allowNull: false
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    avatar: {
      type: Sequelize.STRING,
      defaultValue: process.env.USER_DEFAULT_AVATER
    }
  },
  { hooks, tableName }
);

User.prototype.toJSON = function() {
  const { password, ...rest } = Object.assign({}, this.get());
  return rest;
};

User.hasOne(AgencyProfile, { as: 'agency_profile', foreignKey: 'user_id' });
User.hasMany(UserCategory, { as: 'user_category', foreignKey: 'user_id' });

User.hasMany(PropertyListing, { as: 'property', foreignKey: 'user_id' });
User.hasMany(SavedProperties, { as: 'saved_properties', foreignKey: 'user_id' });

module.exports = User;
