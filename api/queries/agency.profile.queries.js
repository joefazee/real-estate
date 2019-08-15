require('dotenv').config();
const Sequelize = require('sequelize');
const AgencyProfile = require('../models/AgencyProfile');
const EmailService = require('../services/email.service');
const sequelize = require('../../config/database');
const UserQuery = require('./user.queries');

class AgencyProfileQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  findByUserId(user_id) {
    return this.Model.findOne({ where: { user_id } });
  }

  findAll() {
    return this.Model.findAll();
  }

  findByProfileId(id) {
    return this.Model.findOne({ where: { id } });
  }

  approveUserProfile(profile) {
    return new Promise(async (resolve, reject) => {
      try {
        await EmailService.connect();

        const transaction = await sequelize.transaction({ autocommit: false });
        const { email: companyEmail, user_id } = profile;

        const { email: sellerEmail } = await UserQuery.findById(user_id);

        await this.Model.update(
          { isApproved: true, approvedAt: Sequelize.literal('CURRENT_TIMESTAMP') },
          { where: { id: profile.id }, transaction }
        );

        EmailService.send({
          from: process.env.EMAIL_SERVICE_FROM,
          to: `${companyEmail}, ${sellerEmail}`,
          subject: 'subject',
          text: 'FINAL TEST MAIL',
          html: '<p>REFACTOR TEST THREE FOR BETTER PERFORMANCE<p>'
        });

        EmailService.on('success', async () => resolve(await transaction.commit()));

        EmailService.on('error', async () => reject(await transaction.rollback()));
      } catch (err) {
        reject(err);
      }
    });
  }
}

const agencyProfileQuery = new AgencyProfileQueries(AgencyProfile);

module.exports = agencyProfileQuery;
