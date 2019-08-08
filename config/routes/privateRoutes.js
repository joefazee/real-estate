const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/category.validation');
const verifyIsAdmin = require('../../api/middlewares/verifyIsAdmin');

const privateRoutes = {
  'GET /users': {
    path: 'UserController.getAll',
    middlewares: [verifyIsAdmin]
  },
  'GET /category': 'CategoryController.getAll',
  'POST /category': {
    path: 'CategoryController.create',
    middlewares: [validate(paramValidation.createCategory, { abortEarly: false }), verifyIsAdmin]
  }
};

module.exports = privateRoutes;
