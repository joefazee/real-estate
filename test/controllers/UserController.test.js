const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../api/models/User');
const UserQuery = require('../../api/queries/user.queries');

let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test('User | create', async () => {
  const res = await request(api)
    .post('/public/signup')
    .set('Accept', /json/)
    .send({
      name: 'Martin Luke',
      email: 'martin@mail.com',
      password: 'securepassword',
      password2: 'securepassword',
      phone: '09057373',
      user_type: 'admin'
    })
    .expect(200);

  expect(res.body.payload).toBeTruthy();

  const user = await User.findByPk(res.body.payload.id);

  expect(user.id).toBe(res.body.payload.id);
  expect(user.email).toBe(res.body.payload.email);

  await user.destroy();
});

test('User | login', async () => {
  const user = await User.create({
    name: 'Martin Luke',
    email: 'martin@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057373',
    user_type: 'admin'
  });

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martin@mail.com',
      password: 'securepassword'
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  expect(user).toBeTruthy();

  await user.destroy();
});

test('User | login | User does not exist', async () => {
  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinil@ttt.co',
      password: 'passssword'
    });

  expect(res.body.token).toBeFalsy();
  expect(res.body).toHaveProperty('message', 'User does not exist');
  expect(res.body).toHaveProperty('statusCode', 404);
});

test('User | login | invalid email or password', async () => {
  const user = await User.create({
    name: 'Martin Luke',
    email: 'martin2@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057373',
    user_type: 'admin'
  });

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martin2@mail.com',
      password: 'password'
    });

  expect(res.body.token).toBeFalsy();
  expect(res.body).toHaveProperty('message', 'invalid email or password');
  expect(res.body).toHaveProperty('statusCode', 400);
  expect(user).toBeTruthy();

  await user.destroy();
});

test('User | get all (auth)', async () => {
  const user = await User.create({
    name: 'Martin Luke',
    email: 'martin@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057373',
    user_type: 'admin'
  });

  const res = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martin@mail.com',
      password: 'securepassword'
    })
    .expect(200);

  expect(res.body.token).toBeTruthy();

  const res2 = await request(api)
    .get('/private/users')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${res.body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(res2.body.payload).toBeTruthy();
  expect(res2.body.payload.length).toBe(1);

  await user.destroy();
});

test(`UserController.forgotpassword | User doesn't exist`, async () => {
  const email = 'emailThatDoesntExist@mail.com';
  const response = await request(api)
    .post(`/public/forgot-password/`)
    .set('Content-Type', 'application/json')
    .send({ email });

  expect(response.body.statusCode).toEqual(404);
  expect(response.body.message).toBe('User not found');
});

test(`UserController.forgotpassword | Password reset link was sent`, async () => {
  const user = await User.create({
    name: 'Test User',
    email: 'test.user@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '08023456789',
    user_type: 'investor'
  });

  const {
    body: { statusCode }
  } = await request(api)
    .post(`/public/forgot-password/`)
    .set('Content-Type', 'application/json')
    .send({ email: 'test.user@mail.com' });

  expect(statusCode).toBe(200);

  await user.destroy();
});

test('UserController.resetPassword | Passwords do not match', async () => {
  const newUser = await User.create({
    name: 'Test User',
    email: 'test.user@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '08023456789',
    user_type: 'investor'
  });

  const { id } = await UserQuery.findByEmail(newUser.email);

  const payload = {
    user_id: id,
    password: 'balderdash',
    confirmPassword: 'poppycock'
  };

  const response = await request(api)
    .post('/public/password-reset')
    .set('Content-Type', 'application/json')
    .send(payload);

  expect(response.body.statusCode).toBe(400);
  expect(response.body.message).toBe('Passwords do not match');
  await newUser.destroy();
});
