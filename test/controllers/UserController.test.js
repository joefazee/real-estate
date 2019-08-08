const request = require("supertest");
const { beforeAction, afterAction } = require("../setup/_setup");
const User = require("../../api/models/User");

let api;

beforeAll(async () => {
	api = await beforeAction();
});

afterAll(() => {
	afterAction();
});
describe("User | Signup", () => {
	test("Correct User Information", async () => {
		const res = await request(api)
			.post("/public/signup")
			.set("Accept", /json/)
			.send({
				name: "Martin",
				email: "martin@mail.com",
				phone: "123456",
				password: "securepassword",
				password2: "securepassword",
				user_type: "investor"
			})
			.expect(200);

		expect(res.body.payload).toBeTruthy();

		const user = await User.findByPk(res.body.payload.id);

		expect(user.id).toBe(res.body.payload.id);
		expect(user.email).toBe(res.body.payload.email);

		await user.destroy();
	});

	test("Wrong User Information", async () => {
		const res = await request(api)
			.post("/public/signup")
			.set("Accept", /json/)
			.send({
				name: "Martin",
				email: "martin@mail.com",
				phone: "123456",
				password: "securepassword",
				password2: "securepassword1",
				user_type: "investor"
			});

		expect(res.body.statusCode).toBe(400);
		expect(res.body.errors.password).toMatch("password does not match");
		expect(res.body.message).toMatch("Passwords does not match");
	});

	test("User Email already exists", async () => {
		const user = await User.create({
			name: "Martin2",
			email: "martin2@mail.com",
			phone: "123456",
			password: "securepassword",
			password2: "securepassword",
			user_type: "investor"
		});

    const res = await request(api)
			.post("/public/signup")
			.set("Accept", /json/)
			.send({
				name: "Martin2",
				email: "martin2@mail.com",
				phone: "123456",
				password: "securepassword",
				password2: "securepassword",
				user_type: "investor"
      });
    
      expect(res.body.statusCode).toBe(400);
      expect(res.body.errors.email).toMatch("email has been taken");
      expect(res.body.message).toMatch("email has been taken");

      await user.destroy();
    });
});

test("User | login", async () => {
	const user = await User.create({
		name: "Martin",
		email: "martin@mail.com",
		phone: "123456",
		password: "securepassword",
		password2: "securepassword",
		user_type: "investor"
	});

	const res = await request(api)
		.post("/public/login")
		.set("Accept", /json/)
		.send({
			email: "martin@mail.com",
			password: "securepassword"
		})
		.expect(200);

	expect(res.body.token).toBeTruthy();

	expect(user).toBeTruthy();

	await user.destroy();
});

test("User | get all (auth)", async () => {
	const user = await User.create({
		name: "Martin",
		email: "martin@mail.com",
		phone: "123456",
		password: "securepassword",
		password2: "securepassword",
		user_type: "investor"
	});

	const res = await request(api)
		.post("/public/login")
		.set("Accept", /json/)
		.send({
			email: "martin@mail.com",
			password: "securepassword"
		})
		.expect(200);

	expect(res.body.token).toBeTruthy();

	const res2 = await request(api)
		.get("/private/users")
		.set("Accept", /json/)
		.set("Authorization", `Bearer ${res.body.token}`)
		.set("Content-Type", "application/json")
		.expect(200);

	expect(res2.body.payload).toBeTruthy();
	expect(res2.body.payload.length).toBe(1);

	await user.destroy();
});
