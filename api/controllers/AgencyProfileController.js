const AgencyProfile = require('../models/AgencyProfile');
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const agencyProfileQuery = require('../queries/agencyProfile.queries');

const AgencyProfileController = () => {
	const createProfile = async (req, res, next) => {
		try {
						// confirm that user is a seller
			const user_type = req.token.user_type;
			if (user_type !== 'seller') {
				return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unauthorized user', {}, { user: 'Unauthorized user' }));
			}
			// check if the user already has an agency profile
			const user_id = req.token.id;
			const userHasProfile = await agencyProfileQuery.findByUserId(user_id);

			if (userHasProfile) {
				return res.json(
					sendResponse(httpStatus.BAD_REQUEST, 'User has an agency profile', {}, { user: 'User has an agency profile' })
				);
			}

			const { business_name, business_address, website, phone, email } = req.body;

			const profile = await agencyProfileQuery.create({
				business_name,
				business_address,
				website,
				phone,
				email,
				user_id,
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
