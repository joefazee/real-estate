const { port } = require('../config');
const authService = require('../services/auth.service');

const signUpMail = (email, user_id, name) => {
  const code = authService.issue({ email });
  const mailTitle = 'Diaspora Invest: Verify Account';
  const verifyLink = new URL(`http://localhost:${port}/api/v1/verify-email/${code},${user_id}`);
  const message = `<div>Hi ${name},</div><div><p>To verify your account with Diaspora-Invest, please click on the following link: <a href=${verifyLink}>Verify my account</a>.</p></div><br><p>Regards,</p><p>Diaposra Invest</p></div>`;
  const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

  return {
    mailBody,
    mailTitle,
    code
  };
};

module.exports = signUpMail;
