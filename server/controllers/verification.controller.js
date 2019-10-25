const httpStatus = require("http-status");

const sendResponse = require("../helpers/response");
const VerificationQuery = require("../queries/verification.query");

exports.verify = async (req, res, next) => {
  try {
    const { email, token, user_id } = req.params;

    const foundRecord = await VerificationQuery.findOneAndDelete({
      code: token,
      user_id
    });

    if (!foundRecord) {
      return res.json(
        sendResponse(
          httpStatus.OK,
          "This Account has been Verified!",
          null,
          null
        )
      );
    }
    
    await VerificationQuery.verifyEmail(user_id);
    return res.json(
      sendResponse(httpStatus.OK, "Account Verified Successfully!", null, null)
    );
  } catch (err) {
    next(err);
  }
};
