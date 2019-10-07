const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const agencyProfileQuery = require("../queries/agency-profile.query");
const EmailService = require("../services/email-event.service");
const UserQuery = require("../queries/user.query");

exports.createProfile = async (req, res, next) => {
  try {
    const { id: user_id } = req.token;

    const { business_name, business_address, website, phone, email } = req.body;

    const documents = [];

    if (Object.keys(req.uploadedFiles).length) {
      const { successfulUpload } = req.uploadedFiles;
      for (let document in successfulUpload) {
        documents.push({
          image: successfulUpload[document].image,
          name: document
        });
      }
    }

    const profile = await agencyProfileQuery.create({
      business_name,
      business_address,
      website,
      phone,
      email,
      user_id,
      documents: JSON.stringify(documents)
    });

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
    const { business_name, phone, website, address } = req.body;

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
    agency_profile.address = address;
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
      const offset = Number(limit) * Number(skip);

      profiles = await agencyProfileQuery.filterBy(search, {
        limit,
        offset
      });
    } else {
      const search = { approved };
      const offset = Number(limit) * Number(skip);
      profiles = await agencyProfileQuery.findAll(search, {
        limit,
        offset
      });
    }

    const transformProfile = profiles.map(profile => {
      return { ...profile, documents: JSON.parse(profile.documents) };
    });

    return res.json(
      sendResponse(httpStatus.OK, "success!", transformProfile, null)
    );
  } catch (err) {
    next(err);
  }
};

exports.approveProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await agencyProfileQuery.findByProfileId(id);

    if (profile.isApproved) {
      return res.json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          "Profile Approved Already!",
          null,
          { error: "Profile Approved Already!" }
        )
      );
    }

    const { email: companyEmail, user_id } = profile;

    const { email: sellerEmail, name } = await UserQuery.findById(user_id);

    await agencyProfileQuery.approveUserProfile(profile);

    EmailService.emit("send-approval-email", {
      companyEmail,
      sellerEmail,
      name
    });
    return res.json(
      sendResponse(httpStatus.OK, "Account Approved Successfully!", null, null)
    );
  } catch (err) {
    next(err);
  }
};
