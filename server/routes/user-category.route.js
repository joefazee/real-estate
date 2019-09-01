const express = require('express');

const authToken = require("../policies/auth.policy");
const { celebrate: validate } = require("celebrate");
const IsInvestor = require("../middlewares/is-investor.middleware");
const getCategories = require("../helpers/categories");
const paramValidation = require("../validations/user-category.validation");
const userCateCtrl = require("../controllers/user-category.controller");

const router = express.Router();

router.use(authToken);

router
  .route('/:id')
  .get([ validate(paramValidation.getCategory, { abortEarly: false }), IsInvestor ], userCateCtrl.getAll);

router
  .route('/')
  .post([ validate(paramValidation.createCategory, { abortEarly: false }), IsInvestor, getCategories ], userCateCtrl.create);

module.exports = router;
