const PropertyListing = require('../models/PropertyListing');

class PropertyListingQueries {
	constructor(Model) {
		this.Model = Model;
	}

	create(payload) {
		return this.Model.create(payload);
	}

	findByUserId(user_id) {
		return this.Model.findOne({
			where: {
				user_id,
			},
		});
	}

	findAll() {
		return this.Model.findAll();
	}

	findByPropertyId(id) {
		return this.Model.findOne({
			where: {
				id,
			},
		});
	}
}

const propertyListingQueries = new PropertyListingQueries(PropertyListing);

module.exports = propertyListingQueries;
