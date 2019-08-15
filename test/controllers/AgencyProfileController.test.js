const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const AgencyProfile = require('../../api/models/AgencyProfile');
const User = require('../../api/models/User');
const authService = require('../../api/services/auth.service');
const UserQuery = require('../../api/queries/user.queries');

let api;
let SELLER_ACCOUNT;
let INVESTOR_ACCOUNT;
let ADMIN_ACCOUNT;

beforeAll(async () => {
  api = await beforeAction();
  SELLER_ACCOUNT = await User.create({
    name: 'Martin Luke',
    email: 'martinl@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057373',
    user_type: 'seller'
  });

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
  await SELLER_ACCOUNT.destroy();
  await ADMIN_ACCOUNT.destroy();
  await INVESTOR_ACCOUNT.destroy();
  afterAction();
});

test('Agency Profile | create (auth)', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinl@mail.com');

  const token = authService().issue(confirmedUser);

  const {
    body: { payload }
  } = await request(api)
    .post('/private/create_profile')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      business_name: 'XYZ Realtors',
      business_address: '10, Balewa Str',
      website: 'www.xyzrealtee.com',
      phone: '123456',
      email: 'info@xyzrealtee.com'
    });

  expect(payload).toBeTruthy();
  const agencyProfile = await AgencyProfile.findByPk(payload.id);
  expect(agencyProfile).toBeTruthy;
  expect(payload.user_id).toBe(confirmedUser.id);
});

test('Agency Profile | create (user is not a seller)', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinluther@mail.com');

  // generate a token
  const token = authService().issue(confirmedUser);

  const { body } = await request(api)
    .post('/private/create_profile')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      business_name: 'XYZ Realtors',
      business_address: '10, Balewa Str',
      website: 'www.xyzrealtee.com',
      phone: '123456',
      email: 'info@xyzrealtee.com'
    });

  expect(body.statusCode).toBe(401);
  expect(body.message).toBe('Unauthorized user');
});

test('Agency Profile | create (user cannot create a second profile)', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinl@mail.com');

  // generate a token
  const token = authService().issue(confirmedUser);

  const { body } = await request(api)
    .post('/private/create_profile')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      business_name: 'XYZ Realtors',
      business_address: '10, Balewa Str',
      website: 'www.xyzrealtee.com',
      phone: '123456',
      email: 'info@xyzrealtee.com'
    });

  expect(body.statusCode).toBe(400);
  expect(body.message).toBe('User has an agency profile');
});

test('Admin | get all agency profiles (auth)', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinking@mail.com');

  // generate a token
  const token = authService().issue(confirmedUser);

  const { body } = await request(api)
    .get('/private/agency_profiles')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  expect(body.statusCode).toBe(200);
  expect(body.payload).toBeTruthy();
  expect(body.payload.length).toBe(1);
});

test('Admin | approve a seller profile', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinking@mail.com');

  // generate a token
  const token = authService().issue(confirmedUser);

  const {
    body: { payload }
  } = await request(api)
    .get('/private/agency_profiles')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  const firstProfileOnListId = payload[0].id;

  const { body } = await request(api)
    .post(`/private/approve-profile/${firstProfileOnListId}`)
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  expect(body.statusCode).toBe(200);
  expect(body.message).toBe('Account Approved Successfully!');
});

test('Admin Error | approve a seller profile that is already approved', async () => {
  // get user details that include id
  const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinking@mail.com');

  // generate a token
  const token = authService().issue(confirmedUser);

  const {
    body: { payload }
  } = await request(api)
    .get('/private/agency_profiles')
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  const firstProfileOnListId = payload[0].id;

  const { body } = await request(api)
    .post(`/private/approve-profile/${firstProfileOnListId}`)
    .set('Accept', /json/)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  expect(body.statusCode).toBe(401);
  expect(body.message).toBe('Profile Approved Already!');
});
