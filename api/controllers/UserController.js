const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const UserQuery = require('../queries/user.queries');
const OTPQuery = require('../queries/otp.queries');
const Mail = require('../services/mail.service');
const { host, port } = require('../../config');
const tokenExpiry = require('../../helpers/tokenExpiry');
const generateOTP = require('../../helpers/otpGenerator');
const EmailService = require('../services/email.service');
const validateToken = require('../services/validateToken.service');

const UserController = () => {
  const register = async (req, res, next) => {
    try {
      const { name, email, phone, password, password2, user_type } = req.body;

      if (password !== password2) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'Passwords does not match',
            {},
            { password: 'password does not match' }
          )
        );
      }

      const userExist = await UserQuery.findByEmail(email);
      if (userExist) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'email has been taken',
            {},
            { email: 'email has been taken' }
          )
        );
      }

      const user = await UserQuery.create({
        name,
        email,
        phone,
        password,
        user_type
      });

      await EmailService.emit('send-verification-email', {
        email,
        user_id: user.id
      });

      return res.json(sendResponse(httpStatus.OK, 'success', user, null));
    } catch (err) {
      next(err);
    }
  };

  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await UserQuery.findByEmail(email);

      if (!user) {
        return res.json(
          sendResponse(
            httpStatus.NOT_FOUND,
            'User does not exist',
            {},
            { error: 'User does not exist' }
          )
        );
      }

      if (bcryptService().comparePassword(password, user.password)) {
        // to issue token with the user object, convert it to JSON
        const token = authService().issue(user.toJSON());

        return res.json(
          sendResponse(httpStatus.OK, 'success', user, null, token)
        );
      }

      return res.json(
        sendResponse(
          httpStatus.BAD_REQUEST,
          'invalid email or password',
          {},
          { error: 'invalid email or password' }
        )
      );
    } catch (err) {
      next(err);
    }
  };

  const forgotPassword = async (req, res, next) => {
    try {
      // Define generic success response to return
      const response = 'Please check your email for your password reset link';

      // Check if user exists
      const { email } = req.body;
      const user = await UserQuery.findByEmail(email);

      // Return generic success response if user is not found
      if (!user) {
        return res.json(
          sendResponse(httpStatus.NOT_FOUND, 'Email does not exist', {}, null)
        );
      }

      // Create payload for OTP queries
      const { id, name } = user;
      const passwordResetToken = generateOTP(6);
      const payload = {
        user_id: id,
        password: passwordResetToken,
        expiry: tokenExpiry(60)
      };

      // If the user has any existing OTP, update it, else create a new OTP
      const existingOTP = await OTPQuery.findByUserID(id);
      if (existingOTP) {
        OTPQuery.update(payload);
      } else {
        OTPQuery.create(payload);
      }

      await EmailService.emit('send-password-reset-email', {
        email,
        name,
        passwordResetToken
      });

      // return generic success response
      // TODO: Find out from Chibueze the proper payload to send back
      return res.json(sendResponse(httpStatus.OK, response, payload, null));
    } catch (err) {
      next(err);
    }
  };

  const resetPassword = async (req, res, next) => {
    try {
      const { email, resetPasswordToken, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'Passwords do not match',
            {},
            null
          )
        );
      }

      const user = await UserQuery.findByEmail(email);

      // Return generic success response if user is not found
      if (!user) {
        // TODO: Find out from Chibueze the proper payload to send back
        return res.json(
          sendResponse(httpStatus.NOT_FOUND, 'Email does not exist', {}, null)
        );
      }

      const { id } = user;

      const otpDetails = await OTPQuery.findByUserID(id);

      const otpValid = await validateToken(id, resetPasswordToken);

      if (!otpValid) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'Password reset token is not valid',
            {},
            null
          )
        );
      }

      const { otp_id } = otpDetails;
      const payload = {
        password: bcryptService().hashPassword(req.body)
      };

      UserQuery.update(payload, { where: { id } });
      OTPQuery.delete(otp_id);
      return res.json(
        sendResponse(httpStatus.OK, 'Password has been reset', {}, null)
      );
    } catch (err) {
      next(err);
    }
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, err => {
      if (err) {
        return res.json(
          sendResponse(
            httpStatus.UNAUTHORIZED,
            'Invalid Token!',
            {},
            { error: 'Invalid Token!' }
          )
        );
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.json(sendResponse(httpStatus.OK, 'success!', users, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    register,
    login,
    validate,
    getAll,
    forgotPassword,
    resetPassword
  };
};

module.exports = UserController;
