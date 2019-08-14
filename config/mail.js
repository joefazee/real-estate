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
      }, 
    };
    break;

  default:
    configuration = {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    };
    break;
}

module.exports = configuration;
