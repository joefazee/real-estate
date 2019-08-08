const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/public/signup
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
			password2: Joi.string()
				.min(6)
				.max(255)
				.required(),
			user_type: Joi.string().required(),
    }
  },

  // POST /api/v1/private/add-category

  createCategory: {
    body: {
      name: Joi.string()
        .min(3)
        .max(255)
        .required()
    }
  }
};
