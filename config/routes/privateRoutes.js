const { celebrate: validate } = require('celebrate');
const profileValidation = require('../../api/validations/agencyProfile.valiation');
const isSelllerMiddleware = require('../../api/middlewares/isSellerMiddleware');

const privateRoutes = {
	'GET /users': 'UserController.getAll',
	'GET /agency_profiles': 'AgencyProfileController.getAllProfiles',

	'POST /create_profile': {
		path: 'AgencyProfileController.createProfile',
		middlewares: [validate(profileValidation.createProfile, { abortEarly: false }), isSelllerMiddleware],
	},
};

module.exports = privateRoutes;
