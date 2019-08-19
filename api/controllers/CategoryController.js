const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const CategoryQuery = require('../queries/category.queries');

const CategoryController = () => {
  const getAll = async (req, res, next) => {
    try {
      const category = await CategoryQuery.findAll();

      return res.json(sendResponse(httpStatus.OK, 'success!', category, null));
    } catch (err) {
      next(err);
    }
  };

  const create = async (req, res, next) => {
    try {
      const { name } = req.body;

      const exitingCategory = await CategoryQuery.findOne({ name });

      if (exitingCategory) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            `${name} already exits`,
            {},
            { name: `${name} already exits` }
          )
        );
      }

      const category = await CategoryQuery.create({ name });

      return res.json(sendResponse(httpStatus.OK, 'success', category, null));
    } catch (error) {
      next(error);
    }
  };

  return {
    getAll,
    create
  };
};

module.exports = CategoryController;
