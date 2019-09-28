const SavedProperties = require('../models/saved-property.model');

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

	// findAll() {
	// 	return this.Model.findAll();
	// }
}

const savedPropertiesQuery = new SavedPropertiesQueries(SavedProperties);

module.exports = savedPropertiesQuery;
