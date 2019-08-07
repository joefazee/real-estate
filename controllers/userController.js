const { User } = require("../config/db");
const UUID = require("uuid");

const createUser = async (req, res) => {
	try {
		// console.log(req.body);

		const user = await User.create({
			...req.body
		});
		console.log("User's auto-generated ID:", user.id);
		res.json({ data: user });
	} catch (error) {
		console.error({ error });
		res.status(400).json({ error });
	}
};

module.exports = { createUser };
