const express = require('express');

const router = express.Router();
const verifyEmail = require("../middlewares/verify-email");
const verificationCtrl = require('../controllers/verification.controller');


router
  .route('/:code')
  .get(verifyEmail, verificationCtrl.verify)

module.exports = router;
