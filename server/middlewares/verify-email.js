const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const authService = require('../services/auth.service');

module.exports = (req, res, next) => {
  const { code } = req.params;
  const [ token, user_id] = code.split(',');
  const { email } = authService.verify(token);

  if (!email) {
    return res.json(
      sendResponse(httpStatus.UNAUTHORIZED, 'Account Cannot Be Verified At This Time!', null)
    );
  }

  req.params = { email, token, user_id };
  next();
};
