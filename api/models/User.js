const Sequelize = require('sequelize');
const crypto = require('crypto');
const sequelize = require('../../config/database');
const { port } = require('../../config');
const bcryptService = require('../services/bcrypt.service');
const EmailService = require('../services/email.service');
const Verification = require('./Verification');
const AgencyProfile = require('./AgencyProfile');
const UserCategory = require('./UserCategory');

const hooks = {
  async beforeSave(user, { transaction }) {
    await EmailService.connect();

    user.password = bcryptService().hashPassword(user);
    const code = crypto.randomBytes(5).toString('hex');
    const payload = { user_id: user.id, code };

    await Verification.create(payload, { transaction });

    const mailTitle = 'Diaspora Invest: Verify Account';
    const verifyLink = new URL(`http://localhost:${port}/api/v1/public/verify-email/${code}`);
    const message = `<p>To very your account, please click on the following link: <a href=${verifyLink}>Verify my account</a>.</p>
      <p>If the link does not work, please copy this URL into your browser and click enter: ${verifyLink}</p>`;
    const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

    EmailService.send({
      from: process.env.EMAIL_SERVICE_FROM,
      to: `${user.email}`,
      subject: `${mailTitle}`,
      text: 'TEST MAIL',
      html: `${mailBody}`
    });

    EmailService.on('success', () => transaction.commit());
    EmailService.on('error', () => transaction.rollback());
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

User.hasOne(Verification, { as: 'verification', foreignKey: 'user_id' });
User.hasOne(AgencyProfile, { as: 'profile', foreignKey: 'user_id' });
User.hasMany(UserCategory, { as: 'user_category', foreignKey: 'user_id' });

module.exports = User;
