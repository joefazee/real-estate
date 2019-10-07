const { celebrate: validate } = require("celebrate");
const express = require("express");

const authToken = require("../policies/auth.policy");
const profileValidation = require("../validations/agency-profile.validation");
const IsAdmin = require("../middlewares/is-admin.middleware");
const IsSeller = require("../middlewares/is-seller.middleware");
const hasCreatedProfile = require("../middlewares/has-profile");
const uploadFile = require("../middlewares/file-upload");
const agencyCtrl = require("../controllers/agency-profile.controller");

const router = express.Router();

router.use(authToken);

router
  .route("/create")
  .post(
    [
      IsSeller,
      hasCreatedProfile,
      validate(profileValidation.createProfile, { abortEarly: false }),
      uploadFile("documents")
    ],
    agencyCtrl.createProfile
  );

router.route("/:id").get(IsSeller, agencyCtrl.getAgencyDetails);


router.route("/get-all").get(IsAdmin, agencyCtrl.getAllProfiles);

router
  .route("/approve/:id")
  .post(
    [
      validate(profileValidation.approveProfile, { abortEarly: false }),
      IsAdmin
    ],
    agencyCtrl.approveProfile
  );

router
  .route("/edit/:id")
  .put(IsSeller, agencyCtrl.editAgencyDetails);

module.exports = router;
