require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const EmailService = require('../services/email.service');

const tableName = 'agency_profile';

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
			references: {
				model: 'users',
			},
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
	},
	{ tableName, timestamps: false }
);

AgencyProfile.prototype.approveUserProfile = function() {
  return new Promise(async (resolve, reject) => {
    try {
      await EmailService.connect();

      const transaction = await sequelize.transaction({ autocommit: false });
      const { email: companyEmail } = this;
      const { email: sellerEmail } = await User.findOne({ id: this.user_id });

      await AgencyProfile.update(
        { isApproved: true, approvedAt: Sequelize.literal('CURRENT_TIMESTAMP') },
        { where: { id: this.id }, transaction }
      );

      EmailService.send({
        from: process.env.EMAIL_SERVICE_FROM,
        to: `${companyEmail}, ${sellerEmail}`,
        subject: 'subject',
        text: 'FINAL TEST MAIL',
        html: '<p>REFACTOR TEST TWO<p>'
      });

      EmailService.on('success', async () => resolve(await transaction.commit()));

      EmailService.on('error', async () => reject(await transaction.rollback()));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = AgencyProfile;
