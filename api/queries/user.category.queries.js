const UserCategory = require('../models/UserCategory');
const sequelize = require('../../config/database');

class UserCategoryQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create({ user_id, categories }) {
    const payload = categories.map(category => ({ ...category, user_id }));
    return this.Model.bulkCreate(payload, { individualHooks: true });
  }

  findByUserId(user_id) {
    const QUERY = `
    SELECT categories.name, categories.id 
    FROM categories 
    INNER JOIN user_categories ON user_categories.category_id = categories.id 
    INNER JOIN users ON user_categories.user_id = users.id 
    WHERE users.id = '${user_id}';`;
    return sequelize.query(QUERY, {
      type: sequelize.QueryTypes.SELECT
    });
  }
}

const UserCategoryQuery = new UserCategoryQueries(UserCategory);

module.exports = UserCategoryQuery;
