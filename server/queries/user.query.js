const User = require('../models/user.model');

class UserQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  findByEmail(email) {
    return this.Model.findOne({ where: { email } });
  }

  findById(id) {
    return this.Model.findOne({ where: { id } });
  }

  update(id, payload) {
    return this.Model.update(payload, { where: { id } });
  }
}

const userQuery = new UserQueries(User);

module.exports = userQuery;
