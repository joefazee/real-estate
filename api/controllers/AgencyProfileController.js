const httpStatus = require('http-status');
const sendResponse = require('../../helpers/response');
const agencyProfileQuery = require('../queries/agency.profile.queries');
const EmailService = require('../services/email.service');
const UserQuery = require('../queries/user.queries');

const uploadFile = require('../middlewares/fileUpload');
const documentQuery = require('../queries/document.queries');

const AgencyProfileController = () => {
	const createProfile = async (req, res, next) => {
		try {
			const { id: user_id } = req.token;

			const {
				business_name,
				business_address,
				website,
				phone,
				email
			} = req.body;

			
			const profile = await agencyProfileQuery.create({
				business_name,
				business_address,
				website,
				phone,
				email,
				user_id
			});

			const { successfulUpload } = req.uploadedFiles;

			let documentArray = [];
			for (let property in successfulUpload) {
				documentArray.push({
					name: property,
					profile_id: profile.id,
					link: successfulUpload[property].image,
					filename: successfulUpload[property].filename
				});
			}

			const documents = await documentQuery.bulkCreate(documentArray);

			return res.json(
				sendResponse(httpStatus.OK, 'success', { ...profile.dataValues }, null)
			);
		} catch (error) {
			next(error);
		}
	};

	const getAllProfiles = async (req, res) => {
		try {
			const profiles = await agencyProfileQuery.findAll();

			return res.json(sendResponse(httpStatus.OK, 'success!', profiles, null));
		} catch (err) {
			next(err);
		}
	};

	const approveProfile = async (req, res, next) => {
    try {
      const { id } = req.params;

      const profile = await agencyProfileQuery.findByProfileId(id);

      if (profile.isApproved) {
        return res.json(
          sendResponse(
            httpStatus.UNAUTHORIZED,
            'Profile Approved Already!',
            {},
            { error: 'Profile Approved Already!' }
          )
        );
      }

      const { email: companyEmail, user_id } = profile;

      const { email: sellerEmail, name } = await UserQuery.findById(user_id);

      await agencyProfileQuery.approveUserProfile(profile);

      EmailService.emit('send-approval-email', { companyEmail, sellerEmail, name });
      return res.json(sendResponse(httpStatus.OK, 'Account Approved Successfully!', {}, null));
    } catch (err) {
      next(err);
    }
  };

	return {
		createProfile,
		getAllProfiles,
		approveProfile
	};
};
module.exports = AgencyProfileController;
