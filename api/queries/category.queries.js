const Category = require('../models/Category');
const sequelize = require('../../config/database');

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

  findByCategory(categories) {
    return sequelize.query(`SELECT id AS category_id FROM categories WHERE ${categories}`, {
      type: sequelize.QueryTypes.SELECT
    });
  }
}

const CategoryQuery = new CategoryQueries(Category);

module.exports = CategoryQuery;
