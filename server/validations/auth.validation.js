const { Joi } = require("celebrate");

module.exports = {
  // POST /api/v1/auth/signup
  createUser: {
    body: {
      name: Joi.string()
        .max(200)
        .required(),
      email: Joi.string()
        .email()
        .max(200)
        .required(),
      phone: Joi.string()
        .max(45)
        .required(),
      password: Joi.string()
        .min(6)
        .max(255)
        .required(),
      password2: Joi.string().required(),
      user_type: Joi.string()
        .valid(["investor", "seller", "admin"])
        .required()
    }
  },

  // POST /api/v1/auth/login
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }
  },

  forgotPassword: {
    body: {
      email: Joi.string()
        .email()
        .max(200)
        .required()
    }
  },

  resetPassword: {
    body: {
      email: Joi.string()
        .email()
        .max(200)
        .required(),
      token: Joi.string()
        .required()
        .length(6),
      password: Joi.string()
        .required()
        .min(6),
      confirmPassword: Joi.string()
        .required()
    }
  }
};
