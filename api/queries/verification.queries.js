const Verification = require('../models/Verification');

class VerificationQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  verifyCode(code) {
    const { expiryAt } = code;
    return new Date() < new Date(expiryAt);
  }

  findCode(code) {
    return this.Model.findOne({ where: { code } });
  }
}

const VerificationQuery = new VerificationQueries(Verification);

module.exports = VerificationQuery;
