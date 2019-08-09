const AgencyProfile = require('../models/AgencyProfile');
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const agencyProfileQuery = require('../queries/agencyProfile.queries');
const User = require('../models/User');

const AgencyProfileController = () => {
	const createProfile = async (req, res, next) => {
		try {
			const { business_name, business_address, website, phone, email } = req.body;

			const profile = await agencyProfileQuery.create({
				business_name,
				business_address,
				website,
				phone,
				email,
				user_id: req.token.user.id,
			});

			return res.json(sendResponse(httpStatus.OK, 'success', profile, null));
		} catch (error) {
			next(error);
		}
	};

	const getAllProfiles = async (req, res) => {
		try {
			const profiles = await AgencyProfile.findAll();

			return res.json(sendResponse(httpStatus.OK, 'success!', profiles, null));
		} catch (err) {
			next(err);
		}
	};

	return {
		createProfile,
		getAllProfiles,
	};
};
module.exports = AgencyProfileController;
