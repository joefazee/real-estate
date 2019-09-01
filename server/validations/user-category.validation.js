const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/category/
  createCategory: {
    body: {
      name: Joi.string()
        .min(3)
        .max(255)
        .required()
    }
  },
  // GET /api/v1/category/:id
  getCategory: {
    params: {
      id: Joi.string()
        .min(36)
        .max(36)
        .required()
    }
  }
};
