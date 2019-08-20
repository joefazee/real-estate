const { Joi } = require('celebrate');

module.exports = {
	// POST /api/v1/private/agency-profile
	createProfile: {
		body: {
			business_name: Joi.string()
				.max(200)
				.required(),
			business_address: Joi.string()
				.max(300)
				.required(),
			website: Joi.string()
				.max(200)
				.required(),
			phone: Joi.string()
				.max(45)
				.required(),
			email: Joi.string()
				.email()
				.max(200)
				.required(),
		},
	},
};
