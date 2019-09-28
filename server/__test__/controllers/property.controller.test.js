const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const Category = require('../../models/category.model');
const PropertyListing = require('../../models/property.model');
const User = require('../../models/user.model');
const authService = require('../../services/auth.service');
const UserQuery = require('../../queries/user.query');
const propertyQuery = require('../../queries/property.query');
const savedPropertiesQuery = require('../../queries/saved-property.query');

let api;
let SELLER_ACCOUNT;
let CATEGORY;
let PROPERTYLISTING;

beforeAll(async () => {
  api = await beforeAction();
  SELLER_ACCOUNT = await User.create({
    name: 'Martin Luke',
    email: 'martinl@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '09057373',
    user_type: 'seller',
    email_verified: true
  });

  INVESTOR_ACCOUNT = await User.create({
    name: 'Martin Luke',
    email: 'martinluther@mail.com',
    password: 'securepassword',
    password2: 'securepassword',
    phone: '090573673',
    user_type: 'investor'
  });

  CATEGORY = await Category.create({
    name: 'Office'
  });

  const token = authService.issue(SELLER_ACCOUNT.toJSON());

  const { body } = await request(api)
    .post('/api/v1/property/create')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      name: 'XYZ Homes',
      description: '3 Blocks of offices',
      address: 'Lekki',
      location: 'Lekki, Lagos',
      category: 'Office',
      price: 'N100m',
      has_C_of_O: true,
      payment_duration: '1 year',
      avg_monthly_payment: 'N20m'
    });

  PROPERTYLISTING = body;
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await Category.destroy({where:{}});
  afterAction();
});

test('Property | get created property (auth)', async () => {
  const propertyListing = await PropertyListing.findByPk(PROPERTYLISTING.payload.id);

  expect(propertyListing).toBeTruthy();
  expect(PROPERTYLISTING.payload).toBeTruthy();
  expect(PROPERTYLISTING.statusCode).toBe(200);
  expect(PROPERTYLISTING.message).toBe('property created successfully');
});

test('Search Property | user search for property', async () => {
  const { body } = await request(api)
    .get(`/api/v1/search?name=${PROPERTYLISTING.payload.name}`)
    .set('Content-Type', 'application/json');
    console.log(body)

  expect(body.payload).toBeTruthy();
  expect(body.statusCode).toBe(200);
  expect(body.message).toBe('success!');
});

test('Property Listing | Investor can save property he/she shows interest in', async () => {
  const token = authService().issue(INVESTOR_ACCOUNT.toJSON());

  const { body } = await request(api)
    .post('/private/save-property')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      property_id: PROPERTYLISTING.payload.id
    });

  expect(body.statusCode).toBe(200);
  expect(body.message).toBe('property saved');
  expect(body.payload).toBeTruthy();
  expect(body.payload).toEqual({});
});

test('Property Listing | Investor cannot re-save property he/she has saved already', async () => {
  const token = authService().issue(INVESTOR_ACCOUNT.toJSON());

  await request(api)
    .post('/private/save-property')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      property_id: PROPERTYLISTING.payload.id
    });

  const { body } = await request(api)
    .post('/private/save-property')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      property_id: PROPERTYLISTING.payload.id
    });

  expect(body.statusCode).toBe(400);
  expect(body.message).toBe('property already saved by user');
  expect(body.payload).toBeTruthy();
  expect(body.payload).toEqual({});
});

test('Property Listing | Investor can remove a saved property', async () => {
  const token = authService().issue(INVESTOR_ACCOUNT.toJSON());

  const savedListing = await savedPropertiesQuery.create({
    property_id: PROPERTYLISTING.payload.id,
    user_id: INVESTOR_ACCOUNT.toJSON().id
  });

  const { body } = await request(api)
    .post('/private/delete-saved-property')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      property_id: PROPERTYLISTING.payload.id
    });

  expect(body.statusCode).toBe(200);
  expect(body.message).toBe('saved property removed');
  expect(body.payload).toBeTruthy();
  expect(body.payload).toEqual({});
});

test('Property Listing | Investor cannot remove a property that has not been saved', async () => {
  const token = authService().issue(INVESTOR_ACCOUNT.toJSON());

  const { body } = await request(api)
    .post('/private/delete-saved-property')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      property_id: PROPERTYLISTING.payload.id
    });

  expect(body.statusCode).toBe(400);
  expect(body.message).toBe('this property was not saved by user');
  expect(body.payload).toBeTruthy();
  expect(body.payload).toEqual({});
});
