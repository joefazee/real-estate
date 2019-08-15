const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'otp';
const OTP = sequelize.define(
  'OTP',
  {
    otp_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      unique: true
    },
    expiry: {
      type: Sequelize.DATE
    }
  },
  { tableName, timeStamps: true }
);

module.exports = OTP;
