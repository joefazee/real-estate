const User = require('../models/User');

class UserQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  findByEmail(email) {
    return this.Model.findOne({
      where: {
        email
      }
    });
  }

  findById(id) {
    return this.Model.findOne({ where: { id } });
  }
}

const userQuery = new UserQueries(User);

module.exports = userQuery;
