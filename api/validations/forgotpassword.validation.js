const { Joi } = require('celebrate');

module.exports = {
  forgotPassword: {
    body: {
      email: Joi.string()
        .email()
        .max(200)
        .required()
    }
  }
};
