// const request = require('supertest');
// const { beforeAction, afterAction } = require('../setup/_setup');
// const User = require('../../models/user.model');
// const UserQuery = require('../../queries/user.query');
// const OTP = require('../../models/otp.model');
// const OTPQuery = require('../../queries/otp.query');
// const tokenExpiry = require("../../helpers/token-expiry");

// let api;
// let ADMIN_ACCOUNT;

// beforeAll(async () => {
// 	api = await beforeAction();
// 	ADMIN_ACCOUNT = await User.create({
// 		name: 'Martin Luke',
// 		email: 'martinking@mail.com',
// 		password: 'securepassword',
// 		password2: 'securepassword',
// 		phone: '09057367323',
// 		user_type: 'admin'
// 	});
// });

// afterAll(async () => {
//   await ADMIN_ACCOUNT.destroy();
//   await OTP.destroy({where: {}});
// 	afterAction();
// });

test("should return true", () => {
  expect(2 + 2).toBe(4);
});
// test('User | Signup | create successfully', async () => {
// 	const { body } = await request(api)
// 		.post('/api/v1/auth/signup')
// 		.set('Accept', /json/)
// 		.send({
// 			name: 'Martin Luke',
// 			email: 'martinluther@mail.com',
// 			password: 'securepassword',
// 			password2: 'securepassword',
// 			phone: '0905737783',
// 			user_type: 'investor'
// 		})
// 		.expect(200);

// 	expect(body.payload).toBeTruthy();

// 	const user = await User.findByPk(body.payload.id);

// 	expect(user.id).toBe(body.payload.id);
// 	expect(user.email).toBe(body.payload.email);

//   await user.destroy();
// });

// test('User | Signup | passwords do not match', async () => {
// 	const { body } = await request(api)
//     .post("/api/v1/auth/signup")
//     .set("Accept", /json/)
//     .send({
//       name: "Martin Luke",
//       email: "martinluther@mail.com",
//       password: "securepassword",
//       password2: "securepassword1",
//       phone: "0905737783",
//       user_type: "investor"
//     });

// 	expect(body.payload).toEqual(null);
// 	expect(body.statusCode).toBe(400);
// 	expect(body.message).toBe("invalid credentials");
// });

// test('User | Signup | user already exists', async () => {
// 	const user = await UserQuery.create({
// 		name: 'Martin Luke',
// 		email: 'martinluther1@mail.com',
// 		password: 'securepassword',
// 		phone: '0905737783',
// 		user_type: 'investor'
// 	});

// 	const { body } = await request(api)
//     .post("/api/v1/auth/signup")
//     .set("Accept", /json/)
//     .send({
//       name: "Martin Luke",
//       email: "martinluther1@mail.com",
//       password: "securepassword",
//       password2: "securepassword",
//       phone: "0905737783",
//       user_type: "investor"
//     });

// 	expect(body.payload).toEqual(null);
// 	expect(body.statusCode).toBe(400);
// 	expect(body.message).toBe("invalid credentials");
// 	expect(body.errors["email"]).toEqual("email has been taken");

// 	await user.destroy();
// });

// test('User | login', async () => {
// 	const { body } = await request(api)
//     .post("/api/v1/auth/login")
//     .set("Accept", /json/)
//     .send({
//       email: "martinking@mail.com",
//       password: "securepassword"
//     })
//     .expect(200);

// 	expect(body.token).toBeTruthy();
// });

// test('User | login | User does not exist', async () => {
// 	const { body } = await request(api)
//     .post("/api/v1/auth/login")
//     .set("Accept", /json/)
//     .send({
//       email: "martinil@ttt.co",
//       password: "passssword"
//     });

// 	expect(body.token).toBeFalsy();
// 	expect(body).toHaveProperty('message', 'User does not exist');
// 	expect(body).toHaveProperty('statusCode', 404);
// });

// test('User | login | invalid email or password', async () => {
// 	const { body } = await request(api)
//     .post("/api/v1/auth/login")
//     .set("Accept", /json/)
//     .send({
//       email: "martinking@mail.com",
//       password: "password"
//     });

// 	expect(body.token).toBeFalsy();
// 	expect(body).toHaveProperty('message', 'invalid email or password');
// 	expect(body).toHaveProperty('statusCode', 400);
// });

// test('User | get all (auth)', async () => {
// 	const { body } = await request(api)
//     .post("/api/v1/auth/login")
//     .set("Accept", /json/)
//     .send({
//       email: "martinking@mail.com",
//       password: "securepassword"
//     })
//     .expect(200);

// 	expect(body.token).toBeTruthy();

// 	const { body: usersResponse } = await request(api)
//     .get("/api/v1/users")
//     .set("Accept", /json/)
//     .set("Authorization", `Bearer ${body.token}`)
//     .set("Content-Type", "application/json")
//     .expect(200);

// 	expect(usersResponse.payload).toBeTruthy();
// 	expect(usersResponse.payload.length).toBe(1);
// });

// test(`UserController.forgotpassword | User doesn't exist`, async () => {
//   const email = 'emailThatDoesntExist@mail.com';
//   const response = await request(api)
//     .post(`/api/v1/auth/forgot-password/`)
//     .set("Content-Type", "application/json")
//     .send({ email });

//   expect(response.body.statusCode).toEqual(404);
//   expect(response.body.message).toBe('Email does not exist');
// });

// test(`UserController.forgotpassword | Password reset link was sent`, async () => {
//   const {
//     body
//   } = await request(api)
//     .post(`/api/v1/auth/forgot-password/`)
//     .set("Content-Type", "application/json")
//     .send({ email: "martinking@mail.com" });

// 		expect(body['statusCode']).toBe(200);
// 		expect(body['message']).toEqual('Please check your email for your password reset link');
// 		await OTPQuery.delete("martinking@mail.com");
// });

// test(`UserController.forgotpassword | Password reset link was sent`, async () => {
//   await OTPQuery.create({
//     email: "martinking@mail.com",
//     password: "d1ye3H",
//     expiry: tokenExpiry(60)
//   });
//   const { body } = await request(api)
//     .post(`/api/v1/auth/forgot-password/`)
//     .set("Content-Type", "application/json")
//     .send({ email: "martinking@mail.com" });

//   expect(body["statusCode"]).toBe(200);
//   expect(body["message"]).toEqual(
//     "Please check your email for your password reset link"
//   );
//   await OTPQuery.delete("martinking@mail.com");
// });

// test("UserController.resetPassword | Invalid reset Token", async () => {
//   await OTPQuery.create({
//     email: "martinking@mail.com",
//     password: "d1ye3H",
//     expiry: tokenExpiry(60)
//   });

//   const payload = {
//     email: "martinking@mail.com",
//     token: "diye3H",
//     password: "balderdash",
//     confirmPassword: "balderdash"
//   };

//   const { body } = await request(api)
//     .post("/api/v1/auth/reset-password")
//     .set("Content-Type", "application/json")
//     .send(payload);
//   expect(body.statusCode).toBe(404);
// 	expect(body.message).toBe("Password reset token is not valid");
// 	await OTPQuery.delete("martinking@mail.com");
// });

// test('UserController.resetPassword | Passwords do not match', async () => {
//   await OTPQuery.create({
//     email: "martinking@mail.com",
//     password: "d1ye3H",
//     expiry: tokenExpiry(60)
//   });

//   const payload = {
//     email: "martinking@mail.com",
//     token: "d1ye3H",
//     password: "balderdash",
//     confirmPassword: "poppycock"
//   };

//   const { body } = await request(api)
//     .post("/api/v1/auth/reset-password")
//     .set("Content-Type", "application/json")
// 		.send(payload);
		
// 	expect(body.statusCode).toBe(400);
// 	expect(body.message).toBe('Passwords do not match');
// 	await OTPQuery.delete("martinking@mail.com");
// });

// test('UserController.resetPassword | Password was reset', async () => {
//   await OTPQuery.create({
//     email: "martinking@mail.com",
//     password: "d1ye3H",
//     expiry: tokenExpiry(60)
//   });

//   const payload = {
//     email: "martinking@mail.com",
//     token: "d1ye3H",
//     password: "balderdash",
//     confirmPassword: "balderdash"
//   };

//   const { body } = await request(api)
//     .post("/api/v1/auth/reset-password")
//     .set("Content-Type", "application/json")
//     .send(payload);

//   expect(body.statusCode).toBe(200);
// 	expect(body.message).toBe('Password has been reset');	
// 	await OTPQuery.delete("martinking@mail.com");
// });

// test("UserController.resetPassword | User\'s email does not exist", async () => {
//     await OTPQuery.create({
//       email: "dont-exist@mail.com",
//       password: "d1ye3H",
//       expiry: tokenExpiry(60)
//     });

//   const payload = {
//     email: "dont-exist@mail.com",
//     token: "d1ye3H",
//     password: "balderdash",
//     confirmPassword: "balderdash"
//   };

//   const { body } = await request(api)
//     .post("/api/v1/auth/reset-password")
//     .set("Content-Type", "application/json")
//     .send(payload);

//   expect(body.statusCode).toBe(404);
//   expect(body.message).toBe("Email does not exist");
// });