const { celebrate: validate } = require("celebrate");
const express = require('express');

const authToken = require("../policies/auth.policy");
const IsInvestor = require("../middlewares/is-investor.middleware");
const savedPropValidation = require("../validations/property.validation");
const savePropCtrl = require('../controllers/saved-property.controller');

const router = express.Router();

router.use(authToken);

router
  .route('/')
  .post([ validate(savedPropValidation.saveProperty, { abortEarly: false }), IsInvestor ], savePropCtrl.saveProperty)
  .get(IsInvestor, savePropCtrl.getSavedProperty);


router
  .route('/:property_id')
  .delete([ validate(savedPropValidation.deleteProperty, { abortEarly: false }), IsInvestor ], savePropCtrl.deleteSavedProperty);

module.exports = router;
