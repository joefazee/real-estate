const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Document = require('./Document');

const tableName = 'agency_profiles';

const AgencyProfile = sequelize.define(
  'AgencyProfile',
  {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    user_id: {
      type: Sequelize.UUID,
      unique: true,
    },
    business_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    business_address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    website: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isApproved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    approvedAt: {
      type: 'TIMESTAMP',
      allowNull: true,
    },
    images: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    },
  },
  { tableName, timestamps: false }
);

AgencyProfile.hasMany(Document, {
  as: 'profile_document',
  foreignKey: 'profile_id',
});

AgencyProfile.prototype.toJSON = function() {
  const document = Object.assign({}, this.get());
  document.images = JSON.parse(document.images);
  return document;
};

module.exports = AgencyProfile;
