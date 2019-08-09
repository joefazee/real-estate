const AgencyProfile = require('../models/AgencyProfile');

class AgencyProfileQueries {
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
}

const agencyProfileQuery = new AgencyProfileQueries(AgencyProfile);

module.exports = agencyProfileQuery;
