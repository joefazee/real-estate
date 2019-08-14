const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');
const AgencyProfile = require('./AgencyProfile');
const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().hashPassword(user);
  }
};

const tableName = 'users';

const User = sequelize.define(
  'User',
  {
    //attributes
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
      defaultValue: 'investor',
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
    }
  },
  { hooks, tableName }
);

User.prototype.toJSON = function() {
	const values = Object.assign({}, this.get());

	delete values.password;

	return values;
};

User.hasOne(AgencyProfile, { as: 'profile', foreignKey: 'user_id' });

module.exports = User;
