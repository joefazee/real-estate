const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../api/models/User');

let api;
let ADMIN_ACCOUNT;

beforeAll(async () => {
  api = await beforeAction();
  ADMIN_ACCOUNT = await User.create({
    name: 'Martin Luke',
    email: 'martinking@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057367323',
    user_type: 'admin'
  });
});

afterAll(async () => {
  await ADMIN_ACCOUNT.destroy();
  afterAction();
});

test('User | create', async () => {
  const { body } = await request(api)
    .post('/public/signup')
    .set('Accept', /json/)
    .send({
      name: 'Martin Luke',
      email: 'martinluther@mail.com',
      password: 'securepassword',
      password2: 'securepassword',
      phone: '0905737783',
      user_type: 'investor'
    })
    .expect(200);

  expect(body.payload).toBeTruthy();

  const user = await User.findByPk(body.payload.id);

  expect(user.id).toBe(body.payload.id);
  expect(user.email).toBe(body.payload.email);

  await user.destroy();
});

test('User | login', async () => {
  const { body } = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinking@mail.com',
      password: 'securepassword'
    })
    .expect(200);

  expect(body.token).toBeTruthy();
});

test('User | login | User does not exist', async () => {
  const { body } = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinil@ttt.co',
      password: 'passssword'
    });

  expect(body.token).toBeFalsy();
  expect(body).toHaveProperty('message', 'User does not exist');
  expect(body).toHaveProperty('statusCode', 404);
});

test('User | login | invalid email or password', async () => {
  const { body } = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinking@mail.com',
      password: 'password'
    });

  expect(body.token).toBeFalsy();
  expect(body).toHaveProperty('message', 'invalid email or password');
  expect(body).toHaveProperty('statusCode', 400);
});

test('User | get all (auth)', async () => {
  const { body } = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinking@mail.com',
      password: 'securepassword'
    })
    .expect(200);

  expect(body.token).toBeTruthy();

  const { body: usersResponse } = await request(api)
    .get('/private/users')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(usersResponse.payload).toBeTruthy();
  expect(usersResponse.payload.length).toBe(1);
});

test('User | forgot password', async () => {
  const user = await User.create({
    name: 'Luke John',
    email: 'lukejohn@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057373',
    user_type: 'investor'
  });

  const res = await request(api)
    .post('/public/forgot-password')
    .set('Accept', /json/)
    .send({
      email: 'martin@mail.com'
    })
    .expect(200);
  expect(user).toBeTruthy();

  await user.destroy();
});
