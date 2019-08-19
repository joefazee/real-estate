const { uploader } = require('../../config/cloudinaryConfig');
const Datauri = require('datauri');
const path = require('path');

const uploadFile = async (req, _res, next) => {
	try {
		if (Object.keys(req.files).length == 0) {
			throw new Error('No files were provided.');
		}
	} catch (error) {
		return {
			successfulCount: 0,
			overallMessage: 'No files were provided!',
			overallObject: {}
		};
	}
	let fileName;
	let successfulCount = 0;
	let successfulUpload = {};
	let unsuccessfulUpload = {};
	let overallObject = {};
	for (let property in req.files) {
		fileName = property;

		const dUri = new Datauri();
		const dataUri = req =>
			dUri.format(
				path.extname('JJ${req.files[fileName].name}'),
				req.files[fileName].data
			);

		const file = dataUri(req).content;

		await uploader
			.upload(file)
			.then(result => {
				const image = result.url;
				successfulCount += 1;
				successfulUpload[fileName] = {
					filename: req.files[property].name,
					image
				};
			})
			.catch(err => {
				unsuccessfulUpload[fileName] = { filename: null, err };
			});
	}
	req.uploadedFiles = { successfulCount, successfulUpload, unsuccessfulUpload };
	next();
};

module.exports = uploadFile;
