require('dotenv').config();
const sequelize = require('../../config/database');
const User = require('../models/User');

class UserQueries {
  constructor(Model) {
    this.Model = Model;
  }

  async create(signupDetails) {
    const transaction = await sequelize.transaction({ autocommit: false });
    return this.Model.create(signupDetails, { transaction });
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
