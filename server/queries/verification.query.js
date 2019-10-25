const Verification = require('../models/verification.model');
const UserQuery = require('./user.query');
const sequelize = require("../config/database");

class VerificationQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create({ user_id, code }) {
    return this.Model.create({ user_id, code });
  }

  findOneAndDelete( payload ) {
    const { code, user_id } = payload;
    return this.Model.destroy({ where: { code, user_id } });
  }

  verifyEmail(id) {
    const payload = { email_verified: true };
    return UserQuery.update(id, payload);
  }
}

const VerificationQuery = new VerificationQueries(Verification);

module.exports = VerificationQuery;
