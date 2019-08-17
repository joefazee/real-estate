const User = require('../models/User');

class UserQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  update(payload) {
    const updates = { ...payload };
    const { id } = updates;
    delete updates.user_id;
    return this.Model.update(updates, {
      where: {
        id
      }
    });
  }

  findByEmail(email) {
    return this.Model.findOne({
      where: {
        email
      }
    });
  }
}

const userQuery = new UserQueries(User);

module.exports = userQuery;
