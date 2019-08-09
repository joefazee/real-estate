const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const UserCategoryQuery = require('../queries/user.category.queries');
const CategoryQuery = require('../queries/category.queries');

const UserCategoryController = () => {
  const getAll = async (req, res, next) => {
    try {
      const { id: user_id } = req.params;

      const categories = await UserCategoryQuery.findByUserId(user_id);
      return res.json(sendResponse(httpStatus.OK, 'success', categories, null));
    } catch (error) {
      next(error);
    }
  };

  const create = async (req, res, next) => {
    try {
      const {
        selectedCategories,
        token: { id: user_id }
      } = req;

      const categories = await CategoryQuery.findByCategory(selectedCategories);

      const user_category = await UserCategoryQuery.create({ user_id, categories });
      return res.json(sendResponse(httpStatus.OK, 'success', user_category, null));
    } catch (error) {
      next(error);
    }
  };

  return {
    getAll,
    create
  };
};

module.exports = UserCategoryController;
