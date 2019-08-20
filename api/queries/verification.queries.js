const Verification = require('../models/Verification');
const UserQuery = require('./user.queries');

class VerificationQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload, args = {}) {
    return this.Model.create(payload, args);
  }

  findCode(code) {
    return this.Model.findOne({ where: { code } });
  }

  verifyEmail({ email, code }) {
    const payload = { email_verified: true };
    const where = { where: { email } };
    this.Model.destroy({ where: { code } });
    return UserQuery.update(payload, where);
  }
}

const VerificationQuery = new VerificationQueries(Verification);

module.exports = VerificationQuery;
