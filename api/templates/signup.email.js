const { port } = require('../../config');
const authService = require('../services/auth.service');

const signUpMail = email => {
  const code = authService().issue({ email });
  const mailTitle = 'Diaspora Invest: Verify Account';
  const verifyLink = new URL(`http://localhost:${port}/api/v1/public/verify-email/${code}`);
  const message = `<p>To very your account, please click on the following link: <a href=${verifyLink}>Verify my account</a>.</p>`;
  const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

  return {
    mailBody,
    mailTitle,
    code
  };
};

module.exports = signUpMail;
