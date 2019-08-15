const nodemailer = require('nodemailer');
const EventEmitter = require('eventemitter3').EventEmitter;
const transportConfig = require('../../config/mail');

class Mail extends EventEmitter {
  constructor() {
    super();
    this.smtpTransport = nodemailer.createTransport(transportConfig);
  }

  connect() {
    return new Promise((resolve, reject) => {
      return this.smtpTransport.verify((err, success) => {
        return err ? reject(err) : resolve(success);
      });
    });
  }

  send({ from, to, subject, text, html }) {
    const options = { from, to, subject, text, html };

    this.smtpTransport.sendMail(options, (err, success) => {
      if (err) return this.emit('error', err);

      this.emit('success', success);
    });
  }
}

module.exports = new Mail();
