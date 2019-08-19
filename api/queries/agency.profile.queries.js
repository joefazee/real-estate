require('dotenv').config();
const Sequelize = require('sequelize');
const AgencyProfile = require('../models/AgencyProfile');

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
    return this.Model.update(
      { isApproved: true, approvedAt: Sequelize.literal('CURRENT_TIMESTAMP') },
      { where: { id: profile.id } }
    );
  }
}

const agencyProfileQuery = new AgencyProfileQueries(AgencyProfile);

module.exports = agencyProfileQuery;
