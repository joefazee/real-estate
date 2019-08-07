const { Joi } = require("celebrate");

const userSignUp = {
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
			.max(255)
			.required(),
		user_type: Joi.string().required()
	}
};

module.exports = { userSignUp };
