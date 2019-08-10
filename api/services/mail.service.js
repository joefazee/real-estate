const nodemailer = require('nodemailer');
const config = require('../../config/mail');

const { NODE_ENV } = process.env;

let host = config[NODE_ENV].host;
let port = config[NODE_ENV].port;
let user = config[NODE_ENV].username;
let pass = config[NODE_ENV].password;

class Mail {
  constructor() {
    this.host = host;
    this.port = port;
    this.user = user;
    this.pass = pass;
  }

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
   * sets the mail text property
   * @param {string} text
   */
  text(text) {
    this.mailText = text;
    return this;
  }

  /**
   * Sends the mail to the recipient
   * @returns {Promise}
   */
  send() {
    const transport = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pass
      },
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
