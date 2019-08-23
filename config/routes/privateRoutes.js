const { celebrate: validate } = require('celebrate');
const paramValidation = require('../../api/validations/category.validation');
const UserIdValidation = require('../../api/validations/user.category.validation');
const IsAdmin = require('../../api/middlewares/IsAdmin');
const IsInvestor = require('../../api/middlewares/IsInvestor');
const getCategories = require('../../helpers/categories');
const profileValidation = require('../../api/validations/agencyProfile.valiation');
const IsSeller = require('../../api/middlewares/IsSeller');
const hasCreatedProfile = require('../../api/middlewares/hasCreatedProfile');
const uploadFile = require('../../api/middlewares/fileUpload');

const propertyValidation = require('../../api/validations/propertyListing.validation');

const privateRoutes = {
	'GET /users': {
		path: 'UserController.getAll',
		middlewares: [IsAdmin]
	},

	'GET /agency-profiles': {
		path: 'AgencyProfileController.getAllProfiles',
		middlewares: [IsAdmin]
	},

	'POST /create-profile': {
		path: 'AgencyProfileController.createProfile',
		middlewares: [
			validate(profileValidation.createProfile, { abortEarly: false }),
			IsSeller,
			hasCreatedProfile,
			uploadFile('documents')
		]
	},

	'GET /categories': 'CategoryController.getAll',

	'GET /user-category/:id': {
		path: 'UserCategoryController.getAll',
		middlewares: [
			validate(UserIdValidation.validateUserId, { abortEarly: false }),
			IsInvestor
		]
	},

	'POST /category': {
		path: 'CategoryController.create',
		middlewares: [
			validate(paramValidation.createCategory, { abortEarly: false }),
			IsAdmin
		]
	},

	'POST /select-category': {
		path: 'UserCategoryController.create',
		middlewares: [
			validate(paramValidation.createCategory, { abortEarly: false }),
			IsInvestor,
			getCategories
		]
	},

	'POST /approve-profile/:id': {
		path: 'AgencyProfileController.approveProfile',
		middlewares: [
			validate(UserIdValidation.validateUserId, { abortEarly: false }),
			IsAdmin
		]
	},

	'POST /user-category': {
		path: 'UserCategoryController.create',
		middlewares: [
			validate(paramValidation.createCategory, { abortEarly: false }),
			IsInvestor,
			getCategories
		]
	},

	'POST /property-listing': {
		path: 'PropertyListingController.createProperty',
		middlewares: [
			validate(propertyValidation.createProperty, { abortEarly: false }),
			IsSeller,
			uploadFile('images')
		]
	},

	'POST /save-property': {
		path: 'SavedPropertiesController.savePropertyListing',
		middlewares: [
			validate(propertyValidation.savePropertyListing, { abortEarly: false }),
			IsInvestor
		]
	},

	'POST /delete-saved-property': {
		path: 'SavedPropertiesController.deleteSavedPropertyListing',
		middlewares: [
			validate(propertyValidation.deletePropertyListing, { abortEarly: false }),
			IsInvestor
		]
	}
};

module.exports = privateRoutes;
