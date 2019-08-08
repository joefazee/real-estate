const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/category.validation');
const verifyIsAdmin = require('../../api/middlewares/verifyIsAdmin');

const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'GET /category': 'CategoryController.getAll',
  'POST /category': {
    path: 'UserController.register',
    middlewares: [validate(paramValidation.createCategory, { abortEarly: false }), verifyIsAdmin]
  }
};

module.exports = privateRoutes;
