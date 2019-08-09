const UserCategory = require('../models/UserCategory');
const Category = require('../models/Category');

class UserCategoryQueries {
  constructor(Model) {
    this.Model = Model;
  }

  create({ user_id, categories }) {
    const payload = categories.map(category => ({ ...category, user_id }));
    return this.Model.bulkCreate(payload, { individualHooks: true });
  }

  findByUserId(user_id) {
    return this.Model.findAll({
      where: { user_id },
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    });
  }
}

const UserCategoryQuery = new UserCategoryQueries(UserCategory);

module.exports = UserCategoryQuery;
