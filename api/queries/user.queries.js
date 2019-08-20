const User = require('../models/User');

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

  update(payload, where) {
    return this.Model.update(payload, where);
  }
}

const userQuery = new UserQueries(User);

module.exports = userQuery;
