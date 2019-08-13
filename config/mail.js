require('dotenv').config();
let configuration;

switch (process.env.NODE_ENV) {
  case 'production':
    configuration = {
      host: process.env.SEND_GRID_HOST,
      port: process.env.SEND_GRID_PORT,
      auth: {
        user: process.env.SEND_GRID_USERNAME,
        pass: process.env.SEND_GRID_PASSWORD
      }
    };
    break;

  default:
    configuration = {
      host: process.env.MAIL_TRAP_HOST,
      port: process.env.MAIL_TRAP_PORT,
      auth: {
        user: process.env.MAIL_TRAP_USERNAME,
        pass: process.env.MAIL_TRAP_PASSWORD
      }
    };
}

module.exports = configuration;
