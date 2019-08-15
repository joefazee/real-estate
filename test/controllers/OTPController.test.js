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

test(`OTPController.checkOTP | OTP is not valid`, async () => {
  // Test that the old OTP expires when a new OTP is generated

  // Create a test user
  const user = await User.create({
    name: 'Test User',
    email: 'test.user@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '08023456789',
    user_type: 'investor'
  });

  // Request password reset and extract OTP from response
  const {
    body: {
      payload: { password }
    }
  } = await request(api)
    .post(`/public/forgot-password/`)
    .set('Content-Type', 'application/json')
    .send({ email: 'test.user@mail.com' });

  // Request another password reset to cause the first OTP to expire
  await request(api)
    .post(`/public/forgot-password/`)
    .set('Content-Type', 'application/json')
    .send({ email: 'test.user@mail.com' });

  // Make GET request to check OTP validity for old OTP which should have expired
  const response = await request(api).get(`/public/password-reset/${password}`);

  expect(response.body.statusCode).toEqual(404);
  expect(response.body.message).toBe('otp is not valid');

  await user.destroy();
});

test(`OTPController.checkOTP | OTP is valid`, async () => {
  // Test that the OTP is valid before user can reset password

  // Create new user
  const user = await User.create({
    name: 'Test User',
    email: 'test.user@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '08023456789',
    user_type: 'investor'
  });

  // Request password reset and extract OTP from response
  const {
    body: {
      payload: { password }
    }
  } = await request(api)
    .post(`/public/forgot-password/`)
    .set('Content-Type', 'application/json')
    .send({ email: 'test.user@mail.com' });

  // Make GET request to check OTP validity for old OTP which should have expired
  const response = await request(api).get(`/public/password-reset/${password}`);

  expect(response.body.statusCode).toEqual(200);
  expect(response.body.message).toBe('otp is valid');

  await user.destroy();
});
