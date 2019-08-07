const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const authValidation = require("../validations/auth");
const { celebrate: validate } = require("celebrate");
const { userSignUp } = require("../validations/userSignup");
const { createUser } = require("../controllers/userController");

router
	.route("/auth/login")
	.post(validate(authValidation.loginParam), auth.login);

router.post("/signup", validate(userSignUp, { abortEarly: false }), createUser);

module.exports = router;
