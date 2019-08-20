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
        // TODO: Find out from Chibueze the proper payload to send back
        return res.json(
          sendResponse(httpStatus.NOT_FOUND, 'User not found', {}, null)
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

      // Create email with password reset link and send to user
      // TODO: Restructure mail into proper mail template and abstract into its own file
      const mailTitle = `Diaspora Invest: Password Reset`;
      const resetLink = new URL(
        `http://${host}:${port}/api/v1/public/password-reset/`
      );
      const message = `<p>Your password reset token is ${passwordResetToken}.</p>
                      <p>To reset your password, please click on the following link: <a href=${resetLink}>Reset my password</a>.</p>
                      <p>Then enter your email, password reset token and your new password.</p>
                      <p>NOTE: If the link does not work, please copy this URL into your browser and click enter:</p>
                      <p>${resetLink}.</p>`;
      const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

      const mailResult = new Mail()
        .from()
        .to(`${name}<${email}>`)
        .subject(mailTitle)
        .html(mailBody)
        .send();

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
          sendResponse(httpStatus.NOT_FOUND, 'User not found', {}, null)
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
        id: id,
        password: bcryptService().hashPassword(req.body)
      };

      UserQuery.update(payload);
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
