/* eslint-disable no-console */
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const OTPQuery = require('../queries/otp.queries');

const OTPController = () => {
  const checkOTP = async (req, res) => {
    try {
      const { otp } = req.params;
      const otpDetails = await OTPQuery.findOTP(otp);
      const otpValid = otpDetails && new Date() < new Date(otpDetails.expiry);

      if (otpValid) {
        return res.json(
          sendResponse(httpStatus.OK, 'otp is valid', otpDetails, null)
        );
      }

      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'otp is not valid', {}, null)
      );
    } catch (err) {}
  };

  return {
    checkOTP
  };
};

module.exports = OTPController;
