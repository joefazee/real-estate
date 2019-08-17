const nodemailer = require('nodemailer');
const config = require('../../config/mail');

class Mail {
  constructor() {}

  /**
   * method for seting sender
   * @param { string } senderEmail - include email of sender
   * @param { string } senderName - optional name of sender
   */
  from(
    senderEmail = 'no-reply@diasporainvest.com',
    senderName = 'Diaspora Invest'
  ) {
    this.sender = `${senderName} <${senderEmail}>`;

    return this;
  }
  /**
   *
   * @param { string } recipient - email address of the reciever
   */
  to(recipient) {
    this.reciever = recipient;
    return this;
  }

  /**
   * sets the mail subject property
   * @param {string} mailSubject
   */
  subject(mailSubject) {
    this.mailSubject = mailSubject;
    return this;
  }

  /**
   * sets the mail html property
   * @param {string} htmlBody html string format
   */
  html(htmlBody) {
    this.mailHtml = htmlBody;
    return this;
  }

  /**
   * Sends the mail to the recipient
   * @returns {Promise}
   */
  send() {
    const transport = nodemailer.createTransport(config, {
      pool: true, // use pooled connection
      rateLimit: true, // enable to make sure we are limiting
      maxConnections: 3, // set limit to 3 connection
      maxMessages: 5 // send 5 emails per second
    });

    const mailOptions = {
      from: this.sender,
      to: this.reciever,
      subject: this.mailSubject,
      html: this.mailHtml
    };
    return transport.sendMail(mailOptions);
  }
}

module.exports = Mail;
