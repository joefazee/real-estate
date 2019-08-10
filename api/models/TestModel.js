const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const tableName = 'profiles';

const Profile = sequelize.define(
  'Profile',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.STRING(255),
      unique: true,
      allowNull: false,
      references: {
        model: 'users'
      }
    },
    business_name: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    business_address: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    website: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    approvedAt: {
      type: Sequelize.DATEONLY,
      allowNull: true
    }
  },
  { tableName, timestamps: false }
);

Profile.approveUserProfile = async function() {
  return await Profile.update(
    { approved: true, approvedAt: Date.now() },
    { where: { id: this.id } }
  );
};

Profile.belongsTo(User, { as: 'user-profile', foreignKey: 'id' });

module.exports = Profile;
