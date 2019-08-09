const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');

module.exports = (req, res, next) => {
  if (!req.token) {
    return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'No Authorization was found!', null));
  }

  const { user_type } = req.token;

  if (user_type !== 'admin') {
    return res.json(
      sendResponse(
        httpStatus.UNAUTHORIZED,
        'You are not Authorized to perform this operation!',
        null
      )
    );
  }

  next();
};
