/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');
const cookieParser = require("cookie-parser");

/**
 * server configuration
 */
const config = require('./config');
const routes = require('./routes');
const error = require('./config/error');
const dbService = require('./services/db.service');

// environment: development, staging, testing, production
const environment = config.env;
/**
 * File Upload
 */
const fileUpload = require('express-fileupload');
// Environmental variables for the Cloudinary service.
const { cloudinaryConfig } = require('./config/cloudinary-config');

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const DB = dbService(environment, false).start();

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors({ credentials: true, origin: true }));

app.use(cookieParser());

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

// mount all routes on /api path
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

server.listen(config.port, () => {
  console.info(`Server is running on port ${config.port}`)
  return DB;
});
