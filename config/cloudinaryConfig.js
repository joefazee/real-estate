const { config, uploader, v2 } = require('cloudinary');
require('dotenv').config();

const cloudinaryConfig = (req, res, next) => {
	config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
	next();
};

module.exports = { cloudinaryConfig, uploader, v2 };
