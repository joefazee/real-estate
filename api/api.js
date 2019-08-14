/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');

/**
 * server configuration
 */
const config = require('../config/');
const error = require('../config/error');
const dbService = require('./services/db.service');

const auth = require('../api/policies/auth.policy');


// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;
/**
 * File Upload
 */
const fileUpload = require('express-fileupload');
// Environmental variables for the Cloudinary service.
const { cloudinaryConfig } = require('../config/cloudinaryConfig');

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');
const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(
	helmet({
		dnsPrefetchControl: false,
		frameguard: false,
		ieNoOpen: false
	})
);

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Support for uploading files
app.use(fileUpload());
//To get all the cloudinary api keys
app.use('*', cloudinaryConfig);

// secure your private routes with jwt authentication middleware
app.all('/api/v1/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/api/v1/public', mappedOpenRoutes);
app.use('/api/v1/private', mappedAuthRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

server.listen(config.port, () => {

  if (environment !== 'production' && environment !== 'development' && environment !== 'testing') {
    // eslint-disable-next-line no-console
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
  return DB;

});
