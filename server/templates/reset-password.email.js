const { host, port } = require('../config');
const resetPasswordMail = passwordResetToken => {
  const mailTitle = 'Diaspora Invest: Password Reset';
  const resetLink = new URL(
    `http://${host}:${port}/api/v1/auth/reset-password`
  );
  const message = `<p>Your password reset token is ${passwordResetToken}.</p>
                      <p>To reset your password, please click on the following link: <a href=${resetLink}>Reset my password</a>.</p>
                      <p>Then enter your email, password reset token and your new password.</p>
                      <p>NOTE: If the link does not work, please copy this URL into your browser and click enter:</p>
                      <p>${resetLink}.</p>`;
  const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

  return {
    mailBody,
    mailTitle
  };
};

module.exports = resetPasswordMail;
