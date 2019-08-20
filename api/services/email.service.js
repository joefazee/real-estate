require('dotenv').config();
const nodemailer = require('nodemailer');
const EventEmitter = require('eventemitter3').EventEmitter;
const transportConfig = require('../../config/mail');
const signUpMail = require('../templates/signup.email');
const approveProfileMail = require('../templates/approve.profile.email');
const APIError = require('../../helpers/APIError');
const VerificationQuery = require('../queries/verification.queries');

class Mail extends EventEmitter {
  constructor() {
    super();
    this.smtpTransport = nodemailer.createTransport(transportConfig);

    this.on('send-verification-email', ({ email, user_id }) => {
      const { mailBody, mailTitle, code } = signUpMail(email);

      this.sendVerificationMail({
        from: process.env.EMAIL_SERVICE_FROM,
        to: `${email}`,
        subject: `${mailTitle}`,
        text: 'TEST MAIL',
        html: `${mailBody}`,
        user_id,
        code
      });
    });

    this.on('send-approval-email', ({ companyEmail, sellerEmail, name }) => {
      const { mailBody, mailTitle } = approveProfileMail(name);

      this.sendApprovalMail({
        from: process.env.EMAIL_SERVICE_FROM,
        to: `${companyEmail}, ${sellerEmail}`,
        subject: `${mailTitle}`,
        text: 'FINAL TEST MAIL',
        html: `${mailBody}`
      });
    });
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
}

module.exports = new Mail();
