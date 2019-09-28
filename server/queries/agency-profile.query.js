require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const AgencyProfile = require('../models/agency-profile.model');

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

  findByBusinessName(business_name) {
    return this.Model.findOne({ where: { business_name } });
  }

  findByBusinessEmail(email) {
    return this.Model.findOne({ where: { email } });
  }

  findAll(search, { limit, offset }) {
    // return this.Model.findAll();
    return sequelize.query(
      `
    SELECT agency_profiles.id AS profile_id,
     user_id, 
     business_name,
     business_address,
     website, 
     agency_profiles.phone AS profile_phone,
     agency_profiles.email AS profile_email,
     documents, 
     users.name AS user_name, 
     user_type, 
     email_verified, 
     users.email AS user_email,
     users.phone AS user_phone,
     avatar 
    FROM agency_profiles
    JOIN users ON users.id = agency_profiles.user_id
    ORDER BY agency_profiles.business_name ASC 
    LIMIT :offset, :limit`,
      {
        replacements: { ...search, offset, limit },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  findByProfileId(id) {
    return this.Model.findOne({ where: { id } });
  }

  approveUserProfile(profile) {
    return this.Model.update(
      { isApproved: true, approvedAt: Sequelize.literal("CURRENT_TIMESTAMP") },
      { where: { id: profile.id } }
    );
  }

  filterBy(search, { limit, offset }) {
    return sequelize.query(
      `
     SELECT agency_profiles.id AS profile_id,
     user_id, 
     business_name,
     business_address,
     website, 
     agency_profiles.phone AS profile_phone,
     agency_profiles.email AS profile_email,
     documents, 
     users.name AS user_name, 
     user_type, 
     email_verified, 
     users.email AS user_email,
     users.phone AS user_phone,
     avatar 
    FROM agency_profiles
    JOIN users ON users.id = agency_profiles.user_id
    ORDER BY agency_profiles.business_name ASC 
    WHERE agency_profiles.isApproved = :approved
    ORDER BY agency_profiles.business_name ASC 
    LIMIT :offset, :limit`,
      {
        replacements: { ...search, offset, limit },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }
}

const agencyProfileQuery = new AgencyProfileQueries(AgencyProfile);

module.exports = agencyProfileQuery;

