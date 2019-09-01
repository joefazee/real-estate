const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/private/add-category

  createCategory: {
    body: {
      name: Joi.string()
        .min(3)
        .max(1500)
        .required()
    }
  }
};
