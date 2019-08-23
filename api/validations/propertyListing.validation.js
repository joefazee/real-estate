const { Joi } = require('celebrate');

module.exports = {
	createProperty: {
		body: {
			name: Joi.string()
				.max(200)
				.required(),
			description: Joi.string()
				.max(300)
				.required(),
			address: Joi.string()
				.max(300)
				.required(),
			location: Joi.string()
				.max(200)
				.required(),
			category: Joi.string()
				.max(200)
				.required(),
			price: Joi.string()
				.max(100)
				.required(),
			has_C_of_O: Joi.boolean().required(),
			avg_monthly_payment: Joi.string()
				.max(200)
				.required(),
			payment_duration: Joi.string()
				.max(200)
				.required()
		}
	},

	savePropertyListing: {
		body: {
			property_id: Joi.string()
				.max(200)
				.required()
		}
	},

	deletePropertyListing: {
		body: {
			property_id: Joi.string()
				.max(200)
				.required()
		}
	}
};
