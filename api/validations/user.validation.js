const { Joi } = require("celebrate");

module.exports = {
  // POST /api/v1/public/signup
  createUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
      password2: Joi.string()
        .min(6)
        .required()
    }
  }
};
