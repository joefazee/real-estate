const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');

module.exports = (req, res, next) => {
  const { user_type } = req.token;

  if (user_type !== 'admin') {
    return res.json(
      sendResponse(
        httpStatus.UNAUTHORIZED,
        'You are not Authorized to perform this operation!',
        null,
        { error: 'Invalid credentials'}
      )
    );
  }

  next();
};
