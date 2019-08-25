require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
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

  findAll(search, { limit, offset }) {
    // return this.Model.findAll();
    return sequelize.query(
      `
    SELECT * 
    FROM agency_profiles 
    JOIN users ON agency_profiles.user_id = users.id 
    ORDER BY business_name ASC 
    LIMIT :offset, :limit`,
      {
        replacements: { ...search, offset, limit },
        type: sequelize.QueryTypes.SELECT,
      }
    );
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

  filterBy(search, { limit, offset }) {
    return sequelize.query(
      `
    SELECT * 
    FROM agency_profiles 
    JOIN users ON agency_profiles.user_id = users.id 
    WHERE isApproved = :approved
    ORDER BY business_name ASC 
    LIMIT :offset, :limit`,
      {
        replacements: { ...search, offset, limit },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  }
}

const agencyProfileQuery = new AgencyProfileQueries(AgencyProfile);

module.exports = agencyProfileQuery;
