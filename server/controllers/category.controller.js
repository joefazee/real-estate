const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const CategoryQuery = require("../queries/category.query");

exports.getAll = async (req, res, next) => {
  try {
    const category = await CategoryQuery.findAll();

    return res.json(sendResponse(httpStatus.OK, "success!", category, null));
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;

    const exitingCategory = await CategoryQuery.findOne({ name });

    if (exitingCategory) {
      return res.json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          `${name} already exits`,
          null,
          { name: `${name} already exits` }
        )
      );
    }

    const category = await CategoryQuery.create({ name });

    return res.json(sendResponse(httpStatus.OK, "success", category, null));
  } catch (error) {
    next(error);
  }
};
