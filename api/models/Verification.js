const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const Verification = sequelize.define(
  'Verification',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false
    },
    code: {
      type: Sequelize.UUID,
      allowNull: false
    },
    expireAt: {
      type: Sequelize.DATE
    }
  },
  { tableName: 'verification', timestamps: false }
);

Verification.belongsTo(User, { as: 'verification', foreignKey: 'user_id' });

module.exports = Verification;
