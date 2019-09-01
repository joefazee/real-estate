/* eslint-disable no-console */
const httpStatus = require("http-status");
const sendResponse = require("../helpers/response");
const OTPQuery = require("../queries/otp.query");

exports.validateOTP = async (req, res, next) => {
  try {
    const { email, token: password } = req.body;
    const otpDetails = await OTPQuery.findOTP(email, password);
    
    const otpValid = otpDetails && new Date() < new Date(otpDetails.expiry);

    if (otpValid) {
      return next();
    }

    return res.json(
      sendResponse(
        httpStatus.NOT_FOUND,
        "Password reset token is not valid",
        null,
        { error: "Password reset token is not valid" }
      )
    );
  } catch (err) {
    next(err);
  }
};
