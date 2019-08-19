const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const agencyProfileQuery = require('../queries/agency.profile.queries');

module.exports = async (req, res, next) => {
	const user_id = req.token.id;
	const userHasProfile = await agencyProfileQuery.findByUserId(user_id);

	if (userHasProfile) {
		return res.json(
			sendResponse(
				httpStatus.BAD_REQUEST,
				'User has an agency profile',
				{},
				{ user: 'User has an agency profile' }
			)
		);
	}

	next();
};
