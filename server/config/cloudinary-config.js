const { config, uploader, v2 } = require('cloudinary');
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = require('.').spaceCredentials;

const cloudinaryConfig = (req, res, next) => {
	config({
		cloud_name: CLOUDINARY_CLOUD_NAME,
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_API_SECRET
	});
	next();
};

module.exports = { cloudinaryConfig, uploader, v2 };
