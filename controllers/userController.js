const { User } = require("../config/db");

const createUser = async (req, res) => {
	try {
		const user = await User.create({
			...req.body
		});
		res.json({ data: user });
	} catch (error) {
		res.status(400).json({ error });
	}
};

module.exports = { createUser };
