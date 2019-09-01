const express = require("express");
const { celebrate: validate } = require("celebrate");

const authCtrl = require("../controllers/auth.controller");
const { validateOTP } = require("../middlewares/validate-OTP.middleware");
const paramValidation = require("../validations/auth.validation");
const forgotPasswordValidation = require("../validations/forgot-password.validation");
const resetPasswordValidation = require("../validations/reset-password.validation");

const router = express.Router();

router
  .route("/signup")
  .post(
    validate(paramValidation.createUser, { abortEarly: false }),
    authCtrl.register
  );

router
  .route("/login")
  .post(validate(paramValidation.login, { abortEarly: false }), authCtrl.login);

router
  .route("/forgot-password")
  .post(
    validate(paramValidation.forgotPassword, { abortEarly: false }),
    authCtrl.forgotPassword
  );

router
  .route("/reset-password")
  .post(
    [
      validate(paramValidation.resetPassword, { abortEarly: false }),
      validateOTP
    ],
    authCtrl.resetPassword
  );

module.exports = router;
