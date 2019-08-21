const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/user.validation');
const forgotPasswordValidation = require('../../api/validations/forgotpassword.validation');
const resetPasswordValidation = require('../../api/validations/reset.password.validation');
const verifyEmail = require('../../api/middlewares/verifyEmail');


const publicRoutes = {
  'POST /signup': {
    path: 'UserController.register',
    middlewares: [validate(paramValidation.createUser, { abortEarly: false })]
  },
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'GET /verify-email/:code': {
    path: 'VerificationController.verify',
    middlewares: [verifyEmail]
  },
  'POST /forgot-password': {
    path: 'UserController.forgotPassword',
    middlewares: [
      validate(forgotPasswordValidation.forgotPassword, { abortEarly: false })
    ]
  },
  'POST /password-reset': {
    path: 'UserController.resetPassword',
    middlewares: [
      validate(resetPasswordValidation.resetPassword, { abortEarly: false })
    ]
  },
  'GET /property/view/:id': 'PropertyListingController.viewPropertyListing'
};

module.exports = publicRoutes;
