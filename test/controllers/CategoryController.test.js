const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../api/models/User');
const UserQuery = require('../../api/queries/user.queries');
const authService = require('../../api/services/auth.service');

let api;
let SELLER_ACCOUNT;
let INVESTOR_ACCOUNT;
let ADMIN_ACCOUNT;

beforeAll(async () => {
  api = await beforeAction();

  INVESTOR_ACCOUNT = await User.create({
    name: 'Martin Luke',
    email: 'martinluther@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '090573673',
    user_type: 'investor'
  });

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
  await INVESTOR_ACCOUNT.destroy();
  afterAction();
});

test('Admin | login | Admin get all categories', async () => {
  const { body } = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinking@mail.com',
      password: 'securepassword'
    })
    .expect(200);

  expect(body.token).toBeTruthy();

  const { body: categoryResponse } = await request(api)
    .get('/private/categories')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${body.token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(categoryResponse).toHaveProperty('message', 'success!');
  expect(categoryResponse.payload).toBeTruthy();
});

test('Admin | signup | login | Admin create a category', async () => {
  const { body } = await request(api)
    .post('/public/login')
    .set('Accept', /json/)
    .send({
      email: 'martinking@mail.com',
      password: 'securepassword'
    })
    .expect(200);

  expect(body.token).toBeTruthy();

  const { body: categoryResponse } = await request(api)
    .post('/private/category')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${body.token}`)
    .set('Content-Type', 'application/json')
    .send({
      name: 'Sports & entertainment'
    })
    .expect(200);

  expect(categoryResponse.payload).toBeTruthy();
  expect(categoryResponse.payload).toHaveProperty('id');
  expect(categoryResponse.payload).toHaveProperty('name', 'Sports & entertainment');
});

test('Investor | signup | login | Investor select a category', async () => {
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinluther@mail.com');

  const token = authService().issue(confirmedUser);

  expect(token).toBeTruthy();

  const { body } = await request(api)
    .post('/private/user-category')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Sports & entertainment'
    });

  expect(body.payload).toBeTruthy();
  expect(body.statusCode).toBe(200);
  expect(body).toHaveProperty('message', 'success');
  expect(body.payload[0].user_id).toEqual(confirmedUser.id);
});

test('Investor | login | Investor get all his categories', async () => {
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinluther@mail.com');

  const token = authService().issue(confirmedUser);

  expect(token).toBeTruthy();

  const { body } = await request(api)
    .get(`/private/user-categories/${confirmedUser.id}`)
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(body.payload).toBeTruthy();
  expect(body.statusCode).toBe(200);
  expect(body).toHaveProperty('message', 'success');
  expect(body.payload).toContainEqual({ name: 'Sports & entertainment' });
});

test('Unauthorized user aside Admin | login | Unauthorized user aside Admin to create a category', async () => {
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinluther@mail.com');

  const token = authService().issue(confirmedUser);

  expect(token).toBeTruthy();

  const { body } = await request(api)
    .post('/private/category')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      name: 'Office'
    });

  expect(body.statusCode).toBe(401);

  expect(body.message).toMatch(/You are not Authorized to perform this operation!/);
});
