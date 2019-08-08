const AgencyProfile = require('../models/AgencyProfile');

class AgencyProfileQueries {
	constructor(Model) {
		this.Model = Model;
	}

	create(payload) {
		return this.Model.create(payload);
	}
}

const agencyProfileQuery = new AgencyProfileQueries(AgencyProfile);

module.exports = agencyProfileQuery;
