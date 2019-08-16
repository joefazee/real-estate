const Verification = require('../models/Verification');
const UserQuery = require('./user.queries');

class VerificationQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload, args = {}) {
    return this.Model.create(payload, args);
  }

  verifyCode(code) {
    const { expiryAt } = code;
    return new Date() < new Date(expiryAt);
  }

  findCode(code) {
    return this.Model.findOne({ where: { code } });
  }

  verifyEmail({ user_id }) {
    const payload = { email_verified: true };
    const where = { where: { id: user_id } };
    return UserQuery.update(payload, where);
  }
}

const VerificationQuery = new VerificationQueries(Verification);

module.exports = VerificationQuery;
