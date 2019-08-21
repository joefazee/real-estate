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

			if (Object.keys(req.uploadedFiles).length) {
				const { successfulUpload } = req.uploadedFiles;

				let documentArray = [];
				for (let uploadedImage in successfulUpload) {
					documentArray.push({
						property_id: property.id,
						link: successfulUpload[uploadedImage].image,
					});
				}

				imageQuery.bulkCreate(documentArray);
			}

			return res.json(sendResponse(httpStatus.OK, 'property created successfully', property, null));
		} catch (error) {
			next(error);
		}
	};

	const viewPropertyListing = async (req, res, next) => {
		const user_id = req.params.id;

		const viewedListing = await propertyListingQuery.findByPropertyId(user_id)

		if(!viewedListing) {
			res.json(
				sendResponse(httpStatus.BAD_REQUEST, 'Property Listing not found', req.params, null)
			);
		}
		// console.log(listing);
		res.json(sendResponse(httpStatus.OK, 'Property Found', viewedListing, null))
	}

	return {
		createProperty,
		viewPropertyListing
	};
};
module.exports = PropertyListingController;
