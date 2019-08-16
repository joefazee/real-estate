const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const VerificationQuery = require('../queries/verification.queries');

const VerificationController = () => {
  const verify = async (req, res, next) => {
    try {
      const { code } = req.params;
      const foundCode = await VerificationQuery.findCode(code);

      if (!foundCode) {
        return res.json(sendResponse(httpStatus.NOT_FOUND, 'Code does not exist', {}, null));
      }

      const codeIsValid = VerificationQuery.verifyCode(foundCode);

      if (!codeIsValid) {
        return res.json(
          sendResponse(httpStatus.UNAUTHORIZED, 'Code has expired', codeIsValid, null)
        );
      }

      const user = await VerificationQuery.verifyEmail(foundCode);

      return res.json(sendResponse(httpStatus.OK, 'Account Verified Successfully!', user, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    verify
  };
};

module.exports = VerificationController;
