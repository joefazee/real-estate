const { beforeAction, afterAction } = require('../setup/_setup');
const User = require('../../models/user.model');

let user;

beforeAll(async () => {
	await beforeAction();
});

afterAll(() => {
	afterAction();
});

beforeEach(async () => {
	user = await User.create({
		name: 'Martin',
		email: 'martin@mail.com',
		phone: '123456',
		password: 'securepassword',
		password2: 'securepassword',
		user_type: 'investor'
	});
});

test('User is created correctly', async () => {
	const sendUser = user.toJSON();
	// check if user is created
	expect(user.email).toBe('martin@mail.com');
	// check if password is not send to browser
	expect(sendUser.password).toBeFalsy();

	await user.destroy();
});

test('User is updated correctly', async () => {
	await user.update({
		email: 'peter@mail.com'
	});

	expect(user.email).toBe('peter@mail.com');

	await user.destroy();
});
