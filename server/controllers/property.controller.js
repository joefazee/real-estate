const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const CategoryQuery = require("../queries/category.query");
const PropertyQuery = require("../queries/property.query");

exports.createProperty = async (req, res, next) => {
  try {
    const user_id = req.token.id;

    const {
      name,
      description,
      address,
      location,
      category_id,
      price,
      has_C_of_O,
      avg_monthly_payment = "3000",
      payment_duration = "2",
      images
    } = req.body;

    const property = await PropertyQuery.create({
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
      images: `${images.join(",")}`
    });

    return res
      .status(httpStatus.OK)
      .json(
        sendResponse(httpStatus.OK, "property created successfully", null, null)
      );
  } catch (error) {
    next(error);
  }
};

exports.viewProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const viewedListing = await PropertyQuery.findByPropertyId(id);

    if (!viewedListing) {
      return res.json(
        sendResponse(
          httpStatus.NOT_FOUND,
          "Property Listing not found",
          {},
          { error: "property no found" }
        )
      );
    }

    viewedListing.images = viewedListing.images.split(",");

    return res.json(
      sendResponse(httpStatus.OK, "success", viewedListing, null)
    );
  } catch (error) {
    next(error);
  }
};

exports.getAgencyProperties = async (req, res, next) => {
  try {
    const { id } = req.params;

    const viewedListing = await PropertyQuery.findByUser(id);

    if (Boolean(viewedListing)) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, "Property Listing not found", null, {
          error: "property no found"
        })
      );
    }

    viewedListing.images = viewedListing.images.split(",");

    return res.json(
      sendResponse(httpStatus.OK, "success", viewedListing, null)
    );
  } catch (error) {
    next(error);
  }
};

exports.propertyFeed = async (req, res, next) => {
  try {
    let {
      location = "",
      category_id = "",
      minPrice = 0,
      maxPrice = 0,
      name = "",
      limit = 10,
      skip = 0
    } = req.query;

    maxPrice = maxPrice.length === 0 ? Math.pow(10, 5) : +maxPrice;
    minPrice = minPrice.length === 0 ? 0 : +minPrice;

    const search = {
      location: `%${location}%`,
      category_id: `%${category_id}%`,
      name: `%${name}%`,
      minPrice,
      maxPrice
    };


    const offset = +limit * +skip;

    const properties = await PropertyQuery.hasNoFilterOrFilter(search, {
      limit,
      offset
    });

    const transformProperty = properties.map(property => {
      return { ...property, images: property.images.split(",") };
    });

    return res.json(
      sendResponse(httpStatus.OK, "success!", transformProperty, null)
    );
  } catch (err) {
    next(err);
  }
};

exports.minAndMaxPropertyPrice = async (req, res, next) => {
  try {
    const cheapestProperty = (await PropertyQuery.cheapestProperty()) || 0;

    const costliestProperty =
      (await PropertyQuery.costliestProperty()) || 100000000;

    return res.json(
      sendResponse(
        httpStatus.OK,
        "success!",
        { cheapestProperty, costliestProperty },
        null
      )
    );
  } catch (err) {
    next(err);
  }
};
