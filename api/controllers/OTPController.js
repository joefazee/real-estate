/* eslint-disable no-console */
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const OTPQuery = require('../queries/otp.queries');

const OTPController = () => {
  const checkOTP = async (req, res) => {
    try {
      const { otp } = req.params;
      const otpDetails = await OTPQuery.findOTP(otp);

      if (!otpDetails) {
        return res.json(
          sendResponse(httpStatus.NOT_FOUND, 'otp does not exist', {}, err)
        );
      }

      const { expiry } = otpDetails;
      const otpValid = new Date() < new Date(expiry);

      if (!otpValid) {
        return res.json(
          sendResponse(
            httpStatus.UNAUTHORIZED,
            'otp has expired',
            otpValid,
            null
          )
        );
      }

      return res.json(
        sendResponse(httpStatus.OK, 'otp is valid', otpDetails, null)
      );
    } catch (err) {}
  };

  return {
    checkOTP
  };
};

module.exports = OTPController;
