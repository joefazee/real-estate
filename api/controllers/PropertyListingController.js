const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const CategoryQuery = require('../queries/category.queries');
const propertyListingQuery = require('../queries/property.listing.queries');
const imageQuery = require('../queries/property.image.queries');

const PropertyListingController = () => {
	const createProperty = async (req, res, next) => {
		try {
			const user_id = req.token.id;

			const {
				name,
				description,
				address,
				location,
				category,
				price,
				has_C_of_O,
				avg_monthly_payment,
				payment_duration,
			} = req.body;

			const { id: category_id } = await CategoryQuery.findByName(category);

			const property = await propertyListingQuery.create({
				name,
				description,
				address,
				location,
				category_id,
				price,
				has_C_of_O,
				avg_monthly_payment,
				payment_duration,
				user_id,
			});

			const { successfulUpload } = req.uploadedFiles;

			let documentArray = [];
			for (let uploadedImage in successfulUpload) {
				documentArray.push({
					property_id: property.id,
					link: successfulUpload[uploadedImage].image,
				});
			}

			const propertyImages = await imageQuery.bulkCreate(documentArray);

			return res.json(sendResponse(httpStatus.OK, 'property created successfully', property, null));
		} catch (error) {
			next(error);
		}
	};

	return {
		createProperty,
	};
};
module.exports = PropertyListingController;
