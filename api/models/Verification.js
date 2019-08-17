const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'verifications';

const hooks = {
  beforeCreate(verification) {
    const codeExpiry = timeInMins => Date.now() + 1000 * 60 * timeInMins;
    verification.expireAt = codeExpiry(1440);
  }
};

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
      type: Sequelize.STRING,
      allowNull: false
    },
    expireAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  { tableName, hooks }
);

module.exports = Verification;
