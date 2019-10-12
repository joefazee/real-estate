const _ = require("lodash");
const httpStatus = require("http-status");

const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");
const sendResponse = require("../helpers/response");
const UserQuery = require("../queries/user.query");
const OTPQuery = require("../queries/otp.query");
const USER_DEFAULT_AVATAR = require("../config").defaultAvatar;
const tokenExpiry = require("../helpers/token-expiry");
const generateOTP = require("../helpers/otp-generator");
const EmailService = require("../services/email-event.service");

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, password2, user_type } = req.body;
    const errors = {};

    if (password !== password2) {
      errors["password"] = "password does not match";
    }

    const userExist = await UserQuery.findByEmail(email);
    if (userExist) {
      errors["email"] = "email has been taken";
    }

    if (!_.isEmpty(errors)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          "invalid credentials",
          null,
          errors
        )
      );
    }

    const user = await UserQuery.create({
      name,
      email,
      phone,
      password,
      user_type,
      avatar: USER_DEFAULT_AVATAR
    });

    await EmailService.emit("send-verification-email", {
      email,
      user_id: user.id,
      name
    });
    return res.json(sendResponse(httpStatus.OK, "success", user, null));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserQuery.findByEmail(email);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        sendResponse(httpStatus.NOT_FOUND, "User does not exist", null, {
          error: "User does not exist"
        })
      );
    }

    if (!user.email_verified) {
      return res.status(httpStatus.BAD_REQUEST).json(
        sendResponse(httpStatus.BAD_REQUEST, "Please verify your email", null, {
          error: "Please verify your email"
        })
      );
    }

    if (await bcryptService.comparePassword(password, user.password)) {
      // to issue token with the user object, convert it to JSON
      const token = authService.issue(user.toJSON());

      return res.json(
        sendResponse(httpStatus.OK, "success", user, null, token)
      );
    }

    return res.status(httpStatus.BAD_REQUEST).json(
      sendResponse(httpStatus.BAD_REQUEST, "invalid email or password", null, {
        error: "invalid email or password"
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // Define generic success response to return
    const response = "Please check your email for your password reset link";

    // Check if user exists
    const { email } = req.body;
    const user = await UserQuery.findByEmail(email);

    // Return generic success response if user is not found
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        sendResponse(httpStatus.NOT_FOUND, "Email does not exist", null, {
          error: "Email does not exist"
        })
      );
    }

    // Create payload for OTP queries
    const { name } = user;
    const passwordResetToken = generateOTP(6);
    const payload = {
      email,
      password: passwordResetToken,
      expiry: tokenExpiry(60)
    };

    // If the user has any existing OTP, update it, else create a new OTP
    const existingOTP = await OTPQuery.findByUserEmail(email);
    if (existingOTP) {
      await OTPQuery.update(payload);
    } else {
      await OTPQuery.create(payload);
    }

    await EmailService.emit("send-password-reset-email", {
      email,
      name,
      passwordResetToken
    });

    // return generic success response
    return res.json(sendResponse(httpStatus.OK, response, null, null));
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    //confirm passwords matches
    if (password !== confirmPassword) {
      return res.status(httpStatus.BAD_REQUEST).json(
        sendResponse(httpStatus.BAD_REQUEST, "Passwords do not match", null, {
          error: "Passwords does not match"
        })
      );
    }

    const user = await UserQuery.findByEmail(email);

    // Return generic success response if user is not found
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json(
        sendResponse(httpStatus.NOT_FOUND, "Email does not exist", null, {
          error: "Email does not exist"
        })
      );
    }

    const { id } = user;
    //encrpyts the password
    const payload = {
      password: await bcryptService.hashPassword(req.body)
    };

    //upadte's the user's payload
    await UserQuery.update(payload, { where: { id } });
    //Deletes the user's OTP record
    await OTPQuery.delete(email);

    return res.json(
      sendResponse(httpStatus.OK, "Password has been reset", null, null)
    );
  } catch (err) {
    next(err);
  }
};

