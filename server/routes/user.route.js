const express = require("express");

const authToken = require("../policies/auth.policy");
const userCtrl = require('../controllers/user.controller');
const IsAdmin = require("../middlewares/is-admin.middleware");

const router = express.Router();

router
  .route('/')
  .get(authToken, IsAdmin, userCtrl.getAll);

module.exports = router;



