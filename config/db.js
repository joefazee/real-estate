require("dotenv").config();
const Sequelize = require("sequelize");
const userModel = require("../models/user");

sequelize = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_WRITE_HOST,
		dialect: "mysql"
	}
);

const User = userModel(sequelize, Sequelize);

//Synchronizing all models at once
sequelize
	.sync()
	.then(() => {
		console.log("Synchronized!!!");
	})
	.catch(err => {
		console.error("Unable to synchronize", err);
	});

module.exports = { User };
