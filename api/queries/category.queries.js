const Category = require('../models/Category');

class CategoryQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  findAll() {
    return this.Model.findAll();
  }
}

const CategoryQuery = new CategoryQueries(Category);

module.exports = CategoryQuery;
