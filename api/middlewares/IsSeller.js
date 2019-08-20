const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');

module.exports = function (req, res, next) {
  const {user_type} = req.token
  if (user_type !== 'seller') {
		return res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unauthorized user', {}, { user: 'Unauthorized user' }));
  }
  next()
}