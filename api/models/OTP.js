const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'otp';
const FIFTEEN_MINS = 1000 * 60 * 15;
const OTP = sequelize.define(
  'OTP',
  {
    otp_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    expiry: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  { tableName }
);

module.exports = OTP;
