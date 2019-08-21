const privateRoutes = require('./routes/privateRoutes');
const publicRoutes = require('./routes/publicRoutes');

const config = {
  migrate: false,
  privateRoutes,
  publicRoutes,
  port: process.env.PORT || '5000',
  host: process.env.HOST || 'localhost'
};

module.exports = config;
