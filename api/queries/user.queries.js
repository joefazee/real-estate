const User = require('../models/User');


class UserQueries{
  constructor(Model){
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }
}

const userQuery = new UserQueries(User);

module.exports = userQuery;

