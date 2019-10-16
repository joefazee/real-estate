const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');

module.exports = (req, res, next) => {
  const { user_type } = req.token;

  if (user_type !== 'investor') {
    return res.status(401).json(
      sendResponse(
        httpStatus.UNAUTHORIZED,
        "Only Investor can save a property",
        null,
        { error: "Only Investor can save a property" }
      )
    );
  }

  next();
};
