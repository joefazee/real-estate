const request = require('supertest');
const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../api/models/User');
const UserQuery = require('../../api/queries/user.queries');

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

test('User | Signup | create successfully', async () => {
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

test('User | Signup | passwords do not match', async () => {
	const { body } = await request(api)
		.post('/public/signup')
		.set('Accept', /json/)
		.send({
			name: 'Martin Luke',
			email: 'martinluther@mail.com',
			password: 'securepassword',
			password2: 'securepassword1',
			phone: '0905737783',
			user_type: 'investor'
		});

	expect(body.payload).toEqual({});
	expect(body.statusCode).toBe(400);
	expect(body.message).toBe('Passwords does not match');
});

test('User | Signup | user already exists', async () => {
	const user = await UserQuery.create({
		name: 'Martin Luke',
		email: 'martinluther1@mail.com',
		password: 'securepassword',
		phone: '0905737783',
		user_type: 'investor'
	});

	const { body } = await request(api)
		.post('/public/signup')
		.set('Accept', /json/)
		.send({
			name: 'Martin Luke',
			email: 'martinluther1@mail.com',
			password: 'securepassword',
			password2: 'securepassword',
			phone: '0905737783',
			user_type: 'investor'
		});

	expect(body.payload).toEqual({});
	expect(body.statusCode).toBe(400);
	expect(body.message).toBe('email has been taken');

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

test(`UserController.forgotpassword | User doesn't exist`, async () => {
	const email = 'emailThatDoesntExist@mail.com';
	const response = await request(api)
		.post(`/public/forgot-password/`)
		.set('Content-Type', 'application/json')
		.send({ email });

	expect(response.body.statusCode).toEqual(404);
	expect(response.body.message).toBe('User not found');
});

// test(`UserController.forgotpassword | Password reset link was sent`, async () => {
//   const user = await User.create({
//     name: 'Test User',
//     email: 'test.user@mail.com',
//     password: 'securepassword',
//     password2: 'securepassword',
//     phone: '08023456789',
//     user_type: 'investor'
//   });

//   const {
//     body: { statusCode }
//   } = await request(api)
//     .post(`/public/forgot-password/`)
//     .set('Content-Type', 'application/json')
//     .send({ email: 'test.user@mail.com' });

//   expect(statusCode).toBe(200);

//   await user.destroy();
// });

// test('UserController.resetPassword | Passwords do not match', async () => {
//   const newUser = await User.create({
//     name: 'Test User',
//     email: 'test.user@mail.com',
//     password: 'securepassword',
//     password2: 'securepassword',
//     phone: '08023456789',
//     user_type: 'investor'
//   });

//   const { id } = await UserQuery.findByEmail(newUser.email);

//   const payload = {
//     user_id: id,
//     password: 'balderdash',
//     confirmPassword: 'poppycock'
//   };

//   const response = await request(api)
//     .post('/public/password-reset')
//     .set('Content-Type', 'application/json')
//     .send(payload);

//   expect(response.body.statusCode).toBe(400);
//   expect(response.body.message).toBe('Passwords do not match');
//   await newUser.destroy();
// });

// test('UserController.resetPassword | Password was reset', async () => {
//   const newUser = await User.create({
//     name: 'Test User',
//     email: 'test.user@mail.com',
//     password: 'securepassword',
//     password2: 'securepassword',
//     phone: '08023456789',
//     user_type: 'investor'
//   });

//   const { id } = await UserQuery.findByEmail(newUser.email);

//   const payload = {
//     user_id: id,
//     password: 'balderdash',
//     confirmPassword: 'balderdash'
//   };

//   const response = await request(api)
//     .post('/public/password-reset')
//     .set('Content-Type', 'application/json')
//     .send(payload);

//   expect(response.body.statusCode).toBe(200);
//   expect(response.body.message).toBe('Password has been reset');
//   await newUser.destroy();
// });
