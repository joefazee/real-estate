const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const AgencyProfile = require('../../api/models/AgencyProfile');
const User = require('../../api/models/User');
const authService = require('../../api/services/auth.service');
const UserQuery = require('../../api/queries/user.queries');

let api;

beforeAll(async () => {
	api = await beforeAction();
});

afterAll(() => {
	afterAction();
});


test('Agency Profile | create (auth)', async () => {
	const newUser = await User.create({
		name: 'Martin Luke',
		email: 'martinl@mail.com',
		password: 'securepassword',
		password2: 'securepassword',
		phone: '09057373',
		user_type: 'seller',
	});

	const loginDetails = {
		email: 'martinl@mail.com',
		password: 'securepassword',
	};

	// get user details that include id
	const res = await UserQuery.findByEmail(loginDetails.email);

	const confirmedUser = res.dataValues;

	const token = await authService().issue(confirmedUser);

	const res2 = await request(api)
		.post('/private/create_profile')
		.set('Authorization', `Bearer ${token}`)
		.set('Content-Type', 'application/json')
		.send({
			business_name: 'XYZ Realtors',
			business_address: '10, Balewa Str',
			website: 'www.xyzrealtee.com',
			phone: '123456',
			email: 'info@xyzrealtee.com',
		});

	expect(res2.body.payload).toBeTruthy();
	const agencyProfile = await AgencyProfile.findByPk(res2.body.payload.id);
	expect(agencyProfile).toBeTruthy;
	expect(res2.body.payload.user_id).toBe(res.id);
	await newUser.destroy();
});

test('Agency Profile | create (user is not a seller)', async () => {
	const newUser = await User.create({
		name: 'Martin Luke',
		email: 'martinl@mail.com',
		password: 'securepassword',
		password2: 'securepassword',
		phone: '09057373',
		user_type: 'investor',
	});

	const loginDetails = {
		email: 'martinl@mail.com',
		password: 'securepassword',
	};

	// get user details that include id
	const res = await UserQuery.findByEmail(loginDetails.email);

	const confirmedUser = res.dataValues;

	// generate a token
	const token = await authService().issue(confirmedUser);

	const res2 = await request(api)
		.post('/private/create_profile')
		.set('Authorization', `Bearer ${token}`)
		.set('Content-Type', 'application/json')
		.send({
			business_name: 'XYZ Realtors',
			business_address: '10, Balewa Str',
			website: 'www.xyzrealtee.com',
			phone: '123456',
			email: 'info@xyzrealtee.com',
		});

	expect(res2.body.statusCode).toBe(401);
	expect(res2.body.message).toBe('Unauthorized user');
	await newUser.destroy();
});

test('Agency Profile | create (user cannot create a second profile)', async () => {
	const newUser = await User.create({
		name: 'Martin Luke',
		email: 'martinl@mail.com',
		password: 'securepassword',
		password2: 'securepassword',
		phone: '09057373',
		user_type: 'seller',
	});

	const loginDetails = {
		email: 'martinl@mail.com',
		password: 'securepassword',
	};

	// get user details that include id
	const res = await UserQuery.findByEmail(loginDetails.email);

	const confirmedUser = res.dataValues;

	// generate a token
	const token = await authService().issue(confirmedUser);

	await request(api)
		.post('/private/create_profile')
		.set('Authorization', `Bearer ${token}`)
		.set('Content-Type', 'application/json')
		.send({
			business_name: 'XYZ Realtors',
			business_address: '10, Balewa Str',
			website: 'www.xyzrealtee.com',
			phone: '123456',
			email: 'info@xyzrealtee.com',
		});

	const res2 = await request(api)
		.post('/private/create_profile')
		.set('Authorization', `Bearer ${token}`)
		.set('Content-Type', 'application/json')
		.send({
			business_name: 'XYZ Realtors',
			business_address: '10, Balewa Str',
			website: 'www.xyzrealtee.com',
			phone: '123456',
			email: 'info@xyzrealtee.com',
		});

	expect(res2.body.statusCode).toBe(400);
	expect(res2.body.message).toBe('User has an agency profile');
	await newUser.destroy();
});

test('User | get all agency profiles (auth)', async () => {
	const newUser = await User.create({
		name: 'Martin Luke',
		email: 'martinl@mail.com',
		password: 'securepassword',
		password2: 'securepassword',
		phone: '09057373',
		user_type: 'seller',
	});

	const loginDetails = {
		email: 'martinl@mail.com',
		password: 'securepassword',
	};

	// get user details that include id
	const res = await UserQuery.findByEmail(loginDetails.email);

	const confirmedUser = res.dataValues;

	// generate a token
	const token = await authService().issue(confirmedUser);

	await request(api)
		.post('/private/create_profile')
		.set('Authorization', `Bearer ${token}`)
		.set('Content-Type', 'application/json')
		.send({
			business_name: 'XYZ Realtors',
			business_address: '10, Balewa Str',
			website: 'www.xyzrealtee.com',
			phone: '123456',
			email: 'info@xyzrealtee.com',
		});

	const res2 = await request(api)
		.get('/private/agency_profiles')
		.set('Accept', /json/)
		.set('Authorization', `Bearer ${token}`)
		.set('Content-Type', 'application/json');

	expect(res2.body.statusCode).toBe(200);
	expect(res2.body.payload).toBeTruthy();
	expect(res2.body.payload.length).toBe(1);

	await newUser.destroy();
});
