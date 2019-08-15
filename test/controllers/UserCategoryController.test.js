const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../api/models/User');
const authService = require('../../api/services/auth.service');
const UserQuery = require('../../api/queries/user.queries');

let api;
let INVESTOR_ACCOUNT;

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
});

afterAll(async () => {
  await INVESTOR_ACCOUNT.destroy();
  afterAction();
});

test('Investor | signup | login | Investor select a category', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinluther@mail.com');

  const token = authService().issue(confirmedUser);

  const { body } = await request(api)
    .post('/private/user-category')
    .set('Accept', /json/)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Sports & entertainment, Office'
    });

  expect(body).toBeTruthy();
  expect(body.statusCode).toEqual(200);
});

test('Investor | login | Investor get all his categories', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinluther@mail.com');

  const token = authService().issue(confirmedUser);

  const { body } = await request(api)
    .get(`/private/user-categories/${confirmedUser.id}`)
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .expect(200);

  expect(body.payload).toBeTruthy();
  expect(body.statusCode).toEqual(200);
});
