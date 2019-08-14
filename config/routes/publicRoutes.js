const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/user.validation');

const publicRoutes = {
  'POST /signup': {
    path: 'UserController.register',
    middlewares: [validate(paramValidation.createUser, { abortEarly: false })]
  },
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'POST /upload': 'UserController.fileUpload'

};

module.exports = publicRoutes;
