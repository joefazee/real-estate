const { config, uploader, v2 } = require('cloudinary');
const { cloudName, secretAccessKey, accesskeyId } = require('.').spaceCredentials;

const cloudinaryConfig = (req, res, next) => {
	config({
		cloud_name: cloudName,
		api_key: accesskeyId,
		api_secret: secretAccessKey
	});
	next();
};

module.exports = { cloudinaryConfig, uploader, v2 };
