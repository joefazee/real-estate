const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const savedPropertiesQuery = require('../queries/saved.properties.listing.queries');

const SavedPropertiesController = () => {
	const savePropertyListing = async (req, res, next) => {
		try {
			const { id: user_id } = req.token;
			const { property_id } = req.body;
			console.log(user_id, property_id);
			const alreadyExists = await savedPropertiesQuery.findAlreadyExisting({
				user_id,
				property_id
			});
			// console.log(alreadyExists);
			if (alreadyExists) {
				// console.log('here1');

				return res.json(
					sendResponse(
						httpStatus.BAD_REQUEST,
						'failure',
						{},
						{ error: 'property already saved by user' }
					)
				);
			}
			// console.log('here2');
			const savedPropertyListing = await savedPropertiesQuery.create({
				user_id,
				property_id
			});
			// console.log(savedPropertyListing);
			res.json(sendResponse(httpStatus.OK, 'success', {}, null));
		} catch (error) {
			next(error);
		}
	};

	return {
		savePropertyListing
	};
};

module.exports = SavedPropertiesController;
