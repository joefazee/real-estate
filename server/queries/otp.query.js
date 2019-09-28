const OTP = require('../models/otp.model');

class OTPQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  update(payload) {
    const updates = { ...payload };
    const { email } = updates;
    delete updates.user_id;
    return this.Model.update(updates, {
      where: {
        email
      }
    });
  }

  delete(email) {
    return this.Model.destroy({
      where: {
        email
      }
    });
  }

  findOTP(email, password) {
    return this.Model.findOne({
      where: {
        email,
        password
      }
    });
  }

  findByUserEmail(email) {
    return this.Model.findOne({
      where: {
        email
      }
    });
  }
}

const OTPQuery = new OTPQueries(OTP);

module.exports = OTPQuery;
