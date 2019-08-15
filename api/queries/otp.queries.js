const OTP = require('../models/OTP');

class OTPQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  expireOTP(payload) {
    const updates = { ...payload };
    const { user_id } = updates;
    delete updates.user_id;
    return this.Model.update(updates, {
      where: {
        user_id
      }
    });
  }

  findOTP(password) {
    return this.Model.findOne({
      where: {
        password
      }
    });
  }

  findByUserID(user_id) {
    return this.Model.findOne({
      where: {
        user_id
      }
    });
  }
}

const userQuery = new OTPQueries(OTP);

module.exports = userQuery;
