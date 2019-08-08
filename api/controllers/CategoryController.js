const Category = require('../models/Category');
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');

const CategoryController = () => {
  const getAll = async (req, res) => {
    try {
      const category = await Category.findAll();

      return res.json(sendResponse(httpStatus.OK, 'success!', category, null));
    } catch (err) {
      next(err);
    }
  };

  const create = async (req, res, next) => {
    try {
      const category = await Category.create({ ...req.body });
      return res.json(sendResponse(httpStatus.OK, 'success', category, null));
    } catch (error) {
      next(err);
    }
  };

  return {
    getAll,
    create
  };
};

module.exports = CategoryController;
