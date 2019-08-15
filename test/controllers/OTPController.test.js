const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../api/models/User');

let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test(`OTPController.checkOTP | OTP is valid`, async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'test.user@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '08023456789',
    user_type: 'investor'
  });

  const {
    body: {
      payload: { password }
    }
  } = await request(api)
    .post(`/public/forgot-password/`)
    .set('Content-Type', 'application/json')
    .send({ email: 'test.user@mail.com' });

  const response = await request(api).get(`/public/password-reset/${password}`);

  expect(response.body.statusCode).toEqual(200);
  expect(response.body.message).toBe('otp is valid');

  await user.destroy();
});
