const Category = require('../models/Category');
const sequelize = require('../../config/database');

class CategoryQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload, { individualHooks: true });
  }

  findAll() {
    return this.Model.findAll();
  }

  findOne(payload) {
    return this.Model.findOne({ where: payload });
  }

  findByCategory(category) {
    return sequelize.query(`SELECT id AS category_id FROM categories WHERE ${category}`, {
      type: sequelize.QueryTypes.SELECT
    });
  }
}

const CategoryQuery = new CategoryQueries(Category);

module.exports = CategoryQuery;
