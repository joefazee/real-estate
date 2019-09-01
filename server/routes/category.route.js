const { celebrate: validate } = require("celebrate");
const express = require("express");

const authToken = require("../policies/auth.policy");
const paramValidation = require("../validations/category.validation");
const IsAdmin = require("../middlewares/is-admin.middleware");
const categoryCtrl = require("../controllers/category.controller");

const router = express.Router();

router.route("/").get(categoryCtrl.getAll);

router
  .route("/create")
  .post(
    [authToken, IsAdmin, validate(paramValidation.createCategory, { abortEarly: false })],
    categoryCtrl.create
  );

module.exports = router;
