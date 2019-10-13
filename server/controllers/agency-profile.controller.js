const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const AgencyProfileQuery = require("../queries/agency-profile.query");
const DocumentQuery = require("../queries/document.query");
const EmailService = require("../services/email-event.service");
const UserQuery = require("../queries/user.query");

exports.createProfile = async (req, res, next) => {
  try {
    const { id: user_id } = req.token;

    const { business_name, business_address, website, phone, email, documents } = req.body;

    const profile = await AgencyProfileQuery.create({
      business_name,
      business_address,
      website,
      phone,
      email,
      user_id,
    });

    await DocumentQuery.bulkCreate(documents);

    return res.json(sendResponse(httpStatus.OK, "success", profile, null));
  } catch (error) {
    next(error);
  }
};


exports.getAgencyDetails = async (req, res, next) => {
  try {
    const { id: user_id } = req.params;

    let agency_profile = await AgencyProfileQuery.findByUserId(user_id);

    if (!agency_profile) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        sendResponse(httpStatus.UNAUTHORIZED, "invalid agency", null, {
          profile: "invalid profile"
        })
      );
    }

    return res.json(sendResponse(httpStatus.OK, "success", agency_profile, null));
  } catch (err) {
    next(err);
  }
};

exports.editAgencyDetails = async (req, res, next) => {
  try {
    const { id: user_id } = req.params;
    const { business_name, phone, website, business_address } = req.body;

    let agency_profile = await AgencyProfileQuery.findByUserId(user_id);

    if (!agency_profile) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        sendResponse(httpStatus.UNAUTHORIZED, "invalid agency", null, {
          profile: "invalid profile"
        })
      );
    }

    agency_profile.business_name = business_name;
    agency_profile.website = website;
    agency_profile.business_address = business_address;
    agency_profile.phone = phone;

    agency_profile = await agency_profile.save();

    return res.json(sendResponse(httpStatus.OK, "success", agency_profile, null));
  } catch (err) {
    next(err);
  }
};

exports.getAllProfiles = async (req, res, next) => {
  try {
    let profiles;
    let { approved = "", limit = 20, skip = 0 } = req.query;

    if (approved === "true" || approved === "false") {
      approved = approved === "true" ? 1 : 0;
      const search = { approved };
      const offset = +limit * +skip;

      profiles = await AgencyProfileQuery.filterBy(search, {
        limit,
        offset
      });
    } else {
      const search = { approved };
      const offset = +limit * +skip;
      profiles = await AgencyProfileQuery.findAll(search, {
        limit,
        offset
      });
    }

    return res.json(
      sendResponse(httpStatus.OK, "success!", profiles, null)
    );
  } catch (err) {
    next(err);
  }
};

exports.approveProfile = async (req, res, next) => {
  try {
    const { id, action } = req.body;

    const profile = await AgencyProfileQuery.findByProfileId(id);

    const { email: companyEmail, user_id } = profile;

    const { email: sellerEmail, name } = await UserQuery.findById(user_id);

    if (action === 'approve') {
      await AgencyProfileQuery.approveUserProfile(profile, true);

      EmailService.emit("send-approval-email", {
        companyEmail,
        sellerEmail,
        name
      });
    }

    if (action === "unapprove") {
      await AgencyProfileQuery.approveUserProfile(profile, false);
    }

    return res.json(
      sendResponse(httpStatus.OK, `Account ${action} Successfully!`, null, null)
    );
  } catch (err) {
    next(err);
  }
};
