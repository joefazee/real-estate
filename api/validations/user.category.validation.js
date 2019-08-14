const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/private/user-category

  validateUserId: {
    params: {
      id: Joi.string()
        .min(36)
        .max(36)
        .required()
    }
  }
};
