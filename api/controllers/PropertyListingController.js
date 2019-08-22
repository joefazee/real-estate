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
        user_id
      });

      if (Object.keys(req.uploadedFiles).length) {
        const { successfulUpload } = req.uploadedFiles;

        let documentArray = [];
        for (let uploadedImage in successfulUpload) {
          documentArray.push({
            property_id: property.id,
            link: successfulUpload[uploadedImage].image
          });
        }

        imageQuery.bulkCreate(documentArray);
      }

      return res.json(sendResponse(httpStatus.OK, 'property created successfully', property, null));
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

      const search = { location, category_id, name: `%${name}%`, minPrice, maxPrice };

      const offset = +limit * +skip;

      const properties = await PropertyListingQuery.hasNoFilterOrFilter(search, { limit, offset });
      return res.json(sendResponse(httpStatus.OK, 'success!', properties, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    createProperty,
    getAllProperties
  };
};
module.exports = PropertyListingController;
