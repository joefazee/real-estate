const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/category.validation');
const IsAdmin = require('../../api/middlewares/IsAdmin');
const IsInvestor = require('../../api/middlewares/IsInvestor');
const getCategories = require('../../helpers/categories');

const privateRoutes = {
  'GET /users': {
    path: 'UserController.getAll',
    middlewares: [IsAdmin]
  },
  'GET /category': 'CategoryController.getAll',

  'GET /user-category': {
    path: 'UserCategoryController.getAll',
    middlewares: [IsInvestor]
  },

  'POST /category': {
    path: 'CategoryController.create',
    middlewares: [validate(paramValidation.createCategory, { abortEarly: false }), IsAdmin]
  },

  'POST /user-category': {
    path: 'UserCategoryController.create',
    middlewares: [
      validate(paramValidation.createCategory, { abortEarly: false }),
      IsInvestor,
      getCategories
    ]
  }
};

module.exports = privateRoutes;
