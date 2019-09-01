/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');

const database = require('../../config/database');
const routes =  require('../../routes');

const beforeAction = async () => {
  const testapp = express();

  testapp.use(bodyParser.urlencoded({ extended: false }));
  testapp.use(bodyParser.json());

  testapp.use('/api/v1', routes);


  await database.authenticate();
  await database.drop();
  await database.sync().then(() => console.log('Connection to the database has been established successfully'));

  return testapp;
};

const afterAction = async () => {
  await database.close();
};


module.exports = { beforeAction, afterAction };
