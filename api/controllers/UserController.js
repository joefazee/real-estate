const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const UserQuery = require('../queries/user.queries');
const OTPQuery = require('../queries/otp.queries');
const Mail = require('../services/mail.service');
const crypto = require('crypto');
const { port } = require('../../config');
const uploadFile = require('../../helpers/fileUpload');
const EmailService = require('../services/email.service');
const encodeUserEmail = require('../templates/signup.email');
const VerificationQuery = require('../queries/verification.queries');

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

      const { mailBody, mailTitle, code } = encodeUserEmail(email);

      EmailService.send({
        from: process.env.EMAIL_SERVICE_FROM,
        to: `${email}`,
        subject: `${mailTitle}`,
        text: 'TEST MAIL',
        html: `${mailBody}`
      });

      EmailService.on('error', err => next(err));

      EmailService.on('success', async () => {
        try {
          const user = await UserQuery.create({
            name,
            email,
            phone,
            password,
            user_type
          });

          VerificationQuery.create({ user_id: user.id, code });

          return res.json(sendResponse(httpStatus.OK, 'success', user, null));
        } catch (err) {
          next(err);
        }
      });
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

        return res.json(sendResponse(httpStatus.OK, 'success', user, null, token));
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
        return res.json(sendResponse(httpStatus.OK, 'success', 'user doesnt exist', null));
      }

      // Create payload for OTP queries
      const { id, name } = user;
      const temporaryPassword = crypto.randomBytes(20).toString('hex');
      const tokenExpiry = timeInMins => Date.now() + 1000 * 60 * timeInMins;

      // If the user has any existing OTPs, set them to expire
      const existingOTP = await OTPQuery.findByUserID(id);

      if (existingOTP) {
        const payload = {
          user_id: id,
          expiry: tokenExpiry(0)
        };
        await OTPQuery.expireOTP(payload);
      }

      // Create a new OTP for the user
      const payload = {
        user_id: id,
        password: temporaryPassword,
        expiry: tokenExpiry(15)
      };
      await OTPQuery.create(payload);

      // Create email with password reset link and send to user
      // TODO: Restructure mail into proper mail template and abstract into its own file
      const mailTitle = `Diaspora Invest: Password Reset`;
      const resetLink = new URL(
        `http://localhost:${port}/api/v1/public/password-reset/${temporaryPassword}`
      );
      const message = `<p>To reset your password, please click on the following link: <a href=${resetLink}>Reset my password</a>.</p>
                      <p>If the link does not work, please copy this URL into your browser and click enter: ${resetLink}</p>`;
      const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

      const mailResult = new Mail()
        .from()
        .to(`${name}<${email}>`)
        .subject(mailTitle)
        .html(mailBody)
        .send();

      // return generic success response
      // TODO: Find out from Chibueze the proper payload to send back
      return res.json(sendResponse(httpStatus.OK, 'success', mailResult, null));
    } catch (err) {
      next(err);
    }
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, err => {
      if (err) {
        return res.json(
          sendResponse(httpStatus.UNAUTHORIZED, 'Invalid Token!', {}, { error: 'Invalid Token!' })
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

  const fileUpload = async (req, res) => {
    return await uploadFile(req, res);
  };

  return {
    register,
    login,
    validate,
    getAll,
    fileUpload,
    forgotPassword
  };
};

module.exports = UserController;
