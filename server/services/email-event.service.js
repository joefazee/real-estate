const nodemailer = require('nodemailer');
const EventEmitter = require('eventemitter3').EventEmitter;
const { sender, ...rest } = require('../config').mail;
const signUpMail = require('../templates/signup.email');
const approveProfileMail = require('../templates/approve.profile.email');
const resetPasswordMail = require('../templates/reset-password.email');
const APIError = require('../helpers/APIError');
const VerificationQuery = require('../queries/verification.query');

class Mail extends EventEmitter {
  constructor() {
    super();
    this.smtpTransport = nodemailer.createTransport(rest);

    this.on('send-verification-email', ({ email, user_id, name }) => {
      const { mailBody, mailTitle, code } = signUpMail(email, user_id, name);

      this.sendVerificationMail({
        from: sender,
        to: `${email}`,
        subject: `${mailTitle}`,
        text: 'TEST MAIL',
        html: `${mailBody}`,
        user_id,
        code,
      });
    });

    this.on('send-approval-email', ({ companyEmail, sellerEmail, name }) => {
      const { mailBody, mailTitle } = approveProfileMail(name);

      this.sendApprovalMail({
        from: sender,
        to: `${companyEmail}, ${sellerEmail}`,
        subject: `${mailTitle}`,
        text: 'FINAL TEST MAIL',
        html: `${mailBody}`
      });
    });

    this.on(
      'send-password-reset-email',
      ({ email, name, passwordResetToken }) => {
        const { mailBody, mailTitle } = resetPasswordMail(passwordResetToken);

        this.sendPasswordResetEmail({
          from: sender,
          to: `${name} <${email}>`,
          subject: `${mailTitle}`,
          text: '',
          html: `${mailBody}`
        });
      }
    );
  }

  sendVerificationMail({ from, to, subject, text, html, user_id, code }) {
    const options = { from, to, subject, text, html };

    this.smtpTransport.sendMail(options, (err, success) => {
      if (err)
        throw new APIError({
          message: 'Signup mail not sent',
          errors: { error: 'ERROR SENDING SIGNUP VERIFICATION EMAIL' }
        });

      VerificationQuery.create({ user_id, code });
    });
  }

  sendApprovalMail({ from, to, subject, text, html }) {
    const options = { from, to, subject, text, html };

    this.smtpTransport.sendMail(options, (err, success) => {
      if (err)
        throw new APIError({
          message: 'Approval mail not sent',
          errors: { error: 'ERROR SENDING USER APPROVAL EMAIL' }
        });
    });
  }

  sendPasswordResetEmail({ from, to, subject, text, html }) {
    const options = { from, to, subject, text, html };

    this.smtpTransport.sendMail(options, (err, success) => {
      if (err)
        throw new APIError({
          message: 'Password reset mail not sent',
          errors: { error: 'ERROR SENDING PASSWORD RESET EMAIL' }
        });
    });
  }
}

module.exports = new Mail();
