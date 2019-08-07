const { Joi } = require("celebrate");

const loginParam = {
	body: {
		email: Joi.string()
			.email()
			.required(),
		password: Joi.string().required()
	}
};

module.exports = { loginParam };
