const { uploader, v2 } = require('../config/cloudinary-config');
const Datauri = require('datauri');
const path = require('path');

const uploadFile = location => async (req, _res, next) => {
	try {
		if (req.files === null) {
			req.uploadedFiles = {};
			return next();
		}
		let fileName;
		let successfulUpload = {};
		let unsuccessfulUpload = {};
		for (let property in req.files) {
			fileName = property;

			const dUri = new Datauri();
			const dataUri = req =>
				dUri.format(
					path.extname(`JJ${req.files[fileName].name}`),
					req.files[fileName].data
				);

			const file = dataUri(req).content;
			await v2.uploader
				.upload(file, { folder: location, use_filename: true})
				.then(result => {
					console.log(result);
					const image = result.url;
					successfulUpload[fileName] = {
						filename: req.files[property].name,
						image
					};
				})
				.catch(err => {
					unsuccessfulUpload[fileName] = { filename: null, err };
				});
		}
		req.uploadedFiles = {
			successfulUpload,
			unsuccessfulUpload
		};
		next();
	} catch (error) {
		return {
			successfulCount: 0,
			overallMessage: 'No files were provided!',
			overallObject: {}
		};
	}
};

module.exports = uploadFile;
