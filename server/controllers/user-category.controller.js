const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const UserCategoryQuery = require("../queries/user-category.query");
const CategoryQuery = require("../queries/category.query");

exports.getAll = async (req, res, next) => {
  try {
    const { id: user_id } = req.params;

    const categories = await UserCategoryQuery.findByUserId(user_id);
    return res.json(sendResponse(httpStatus.OK, "success", categories, null));
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      selectedCategories,
      token: { id: user_id }
    } = req;

    const categories = await CategoryQuery.findByCategory(selectedCategories);

    const user_category = await UserCategoryQuery.create({
      user_id,
      categories
    });
    return res.json(
      sendResponse(httpStatus.OK, "success", user_category, null)
    );
  } catch (error) {
    next(error);
  }
};
