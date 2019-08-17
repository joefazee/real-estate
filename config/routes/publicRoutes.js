const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/user.validation');
const forgotPasswordValidation = require('../../api/validations/forgotpassword.validation');

const publicRoutes = {
  'POST /signup': {
    path: 'UserController.register',
    middlewares: [validate(paramValidation.createUser, { abortEarly: false })]
  },
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'GET /verify-email/:code': 'VerificationController.verify',
  'POST /upload': 'UserController.fileUpload',
  'POST /forgot-password': {
    path: 'UserController.forgotPassword',
    middlewares: [
      validate(forgotPasswordValidation.forgotPassword, { abortEarly: false })
    ]
  },
  'GET /password-reset/:otp': 'OTPController.checkOTP',
  'POST /password-reset/': 'UserController.resetPassword'
};

module.exports = publicRoutes;
