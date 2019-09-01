const httpStatus = require("http-status");
const _ = require('lodash');

const sendResponse = require("../helpers/response");
const agencyProfileQuery = require("../queries/agency-profile.query");

module.exports = async (req, res, next) => {
  const user_id = req.token.id;
	const { business_name, email } = req.body;
	const error = {};

	const userHasProfile = await agencyProfileQuery.findByUserId(user_id);

  if (userHasProfile) {
    return res.json(
      sendResponse(httpStatus.BAD_REQUEST, "User has an agency profile", null, {
        error: "User has an agency profile"
      })
    );
  }

  const profileNameExist = await agencyProfileQuery.findByBusinessName(
    business_name
	);
	if (profileNameExist) error['business_name'] = 'business name has been taken';
	
	const emailExist = await agencyProfileQuery.findByBusinessEmail( email );
	if (emailExist) error['email'] = "email has been taken";

  if (!_.isEmpty(error)) {
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        "Invalid fields",
        null,
        error
      )
    );
  }

  next();
};
