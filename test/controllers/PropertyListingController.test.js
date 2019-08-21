const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const Category = require('../../api/models/Category');
const PropertyListing = require('../../api/models/PropertyListing');
const User = require('../../api/models/User');
const authService = require('../../api/services/auth.service');
const UserQuery = require('../../api/queries/user.queries');

beforeAll(async () => {
	api = await beforeAction();
	SELLER_ACCOUNT = await User.create({
		name: 'Martin Luke',
		email: 'martinl@mail.com',
		password: 'securepassword',
		password2: 'securepassword',
		phone: '09057373',
		user_type: 'seller',
		email_verified: true,
  });
  
	CATEGORY = await Category.create({
		name: 'Office',
  });  
});


afterAll(async () => {
	await SELLER_ACCOUNT.destroy();
  await CATEGORY.destroy();
	afterAction();
});

test('Property Listing | create (auth)', async () => {
	const { dataValues: confirmedUser } = await UserQuery.findByEmail('martinl@mail.com');

  const token = authService().issue(confirmedUser);
  
	const {body} = await request(api)
		.post('/private/property-listing')
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
			avg_monthly_payment: 'N20m',
		});

  const propertyListing = await PropertyListing.findByPk(body.payload.id);
  
	expect(propertyListing).toBeTruthy();
  expect(body.payload).toBeTruthy();
  expect(body.statusCode).toBe(200);
  expect(body.message).toBe('property created successfully');
	expect(body.payload.user_id).toBe(confirmedUser.id);
});
