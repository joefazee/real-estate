const SavedProperties = require('../models/saved-property.model');
const sequelize = require("../config/database");

class SavedPropertiesQueries {
	constructor(Model) {
		this.Model = Model;
	}

	create(payload) {
		return this.Model.create(payload);
	}

	findByUserId(user_id) {
		return this.Model.findOne({
			where: {
				user_id
			}
		});
	}

	find({ user_id, property_id }) {
		return this.Model.findOne({
			where: {
				user_id,
				property_id
			}
		});
	}

	delete({ user_id, property_id }) {
		return this.Model.destroy({
			where: {
				user_id,
				property_id
			}
		});
	}

	findAll({ user_id }) {
		return sequelize.query(
      `
			SELECT saved_properties.id AS id,
			property_id,
			name,
			description,
			address,
			location,
			price,
			has_C_of_O,
			status,
			images,
			payment_duration,
			avg_monthly_payment
			FROM saved_properties
			JOIN properties ON properties.id = saved_properties.property_id
			WHERE saved_properties.user_id = :user_id
			`,
      {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT
      }
    );
	}
}

const savedPropertiesQuery = new SavedPropertiesQueries(SavedProperties);

module.exports = savedPropertiesQuery;
