const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const savedPropertiesQuery = require("../queries/saved-property.query");

exports.saveProperty = async (req, res, next) => {
  try {
    const { id: user_id } = req.token;
    const { property_id } = req.body;

    const alreadyExists = await savedPropertiesQuery.find({
      user_id,
      property_id
    });
    if (alreadyExists) {
      return res.json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          "property already saved by user",
          null,
          { error: "property already saved by user" }
        )
      );
    }

    await savedPropertiesQuery.create({
      user_id,
      property_id
    });

    return res.json(sendResponse(httpStatus.OK, "property saved", null, null));
  } catch (error) {
    next(error);
  }
};

exports.deleteSavedProperty = async (req, res, next) => {
  try {
    const { id: user_id } = req.token;
    const { property_id } = req.params;

    const alreadyExists = await savedPropertiesQuery.find({
      user_id,
      property_id
    });
    if (!alreadyExists) {
      return res.json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          "this property was not saved by user",
          null,
          { error: "this property was not saved by user" }
        )
      );
    }

    await savedPropertiesQuery.delete({
      user_id,
      property_id
    });

    return res.json(
      sendResponse(httpStatus.OK, "saved property removed", null, null)
    );
  } catch (error) {
    next(error);
  }
};
