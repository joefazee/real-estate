const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const VerificationQuery = require('../queries/verification.queries');

const VerificationController = () => {
  const verify = async (req, res, next) => {
    try {
      const { email, code } = req.params;

      await VerificationQuery.verifyEmail({ email, code });

      return res.json(sendResponse(httpStatus.OK, 'Account Verified Successfully!', {}, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    verify
  };
};

module.exports = VerificationController;
