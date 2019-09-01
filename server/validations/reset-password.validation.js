const { Joi } = require('celebrate');

module.exports = {
  resetPassword: {
    body: {
      email: Joi.string()
        .email()
        .max(200)
        .required(),
      resetPasswordToken: Joi.string()
        .required()
        .length(6),
      password: Joi.string()
        .required()
        .min(8),
      confirmPassword: Joi.string()
        .required()
        .min(8)
    }
  }
};
