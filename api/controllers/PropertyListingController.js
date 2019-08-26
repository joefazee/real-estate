const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const CategoryQuery = require('../queries/category.queries');
const PropertyListingQuery = require('../queries/property.listing.queries');
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
        payment_duration
      } = req.body;

      const { id: category_id } = await CategoryQuery.findByName(category);

      let propertyImages = [];
      if (Object.keys(req.uploadedFiles).length) {
        const { successfulUpload } = req.uploadedFiles;

        for (let uploadedImage in successfulUpload) {
          propertyImages.push(successfulUpload[uploadedImage].image);
        }
      }

      const property = await PropertyListingQuery.create({
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
        images: `${propertyImages.join(',')}`
      });

      property.images = property.images.split(',');

      return res.json(sendResponse(httpStatus.OK, 'property created successfully', property, null));
    } catch (error) {
      next(error);
    }
  };

  const viewPropertyListing = async (req, res, next) => {
    try {
      const { id } = req.params;

      const viewedListing = await PropertyListingQuery.findByPropertyId(id);

      if (!viewedListing) {
        return res.json(
          sendResponse(
            httpStatus.NOT_FOUND,
            'Property Listing not found',
            {},
            { error: 'property no found' }
          )
        );
      }

      viewedListing.images = viewedListing.images.split(',');

      return res.json(sendResponse(httpStatus.OK, 'success', viewedListing, null));
    } catch (error) {
      next(error);
    }
  };

  const getAllProperties = async (req, res, next) => {
    try {
      const {
        location = '',
        category_id = '',
        minPrice = 0,
        maxPrice = Math.pow(10, 5),
        name = '',
        limit = 20,
        skip = 0
      } = req.query;

      const search = {
        location,
        category_id,
        name: `%${name}%`,
        minPrice,
        maxPrice
      };

      const offset = +limit * +skip;

      const properties = await PropertyListingQuery.hasNoFilterOrFilter(search, { limit, offset });

      const transformProperty = properties.map(property => {
        return { ...property, images: property.images.split(',') };
      });

      return res.json(sendResponse(httpStatus.OK, 'success!', transformProperty, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    createProperty,
    viewPropertyListing,
    getAllProperties
  };
};
module.exports = PropertyListingController;
