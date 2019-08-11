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
		email: 'martin@mail.com',
		password: 'securepassword',
		password2: 'securepassword',
		phone: '09057373',
		user_type: 'seller',
	});

	const loginDetails = {
		email: 'martin@mail.com',
		password: 'securepassword',
	};

	const res = await UserQuery.findByEmail(loginDetails.email);

	const confirmedUser = res.dataValues;
	delete confirmedUser.password;

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
