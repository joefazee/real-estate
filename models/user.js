const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
	//Modeling a table
	const Model = Sequelize.Model;
	class User extends Model {}
	User.init(
		{
			//attributes
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			phone: {
				type: Sequelize.STRING,
				unique: true
			},
			user_type: {
				type: Sequelize.ENUM(["admin", "investor", "seller"]),
				defaultValue: "investor",
				allowNull: false
			},
			email_verified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			id: {
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			}
		},
		{
			sequelize,
			modelName: "user",
			timestamp: true
		}
	);

	User.beforeSave(async (user, options) => {
		user.password = await bcrypt.hash(user.password, 10);
		return;
	});

	return User;
};
