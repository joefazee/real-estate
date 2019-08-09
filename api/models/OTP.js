const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'otp';

const OTP = sequelize.define(
  'OTP',
  {
    otp_id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  { tableName }
);

module.exports = OTP;
