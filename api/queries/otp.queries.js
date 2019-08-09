const OTP = require('../models/OTP');

class OTPQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  findOTP(otp) {
    return this.Model.findOne({
      where: {
        otp
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
