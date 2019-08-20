/**
 * Returns a custom error object with descriptive messages.
 * @property {Array} arr - Array of Joi validation errors.
 * @returns {Object}
 */
exports.customErrorMessage = (arr) => {
  const errMessage = {};
  for (let i = 0; i < arr.length; i++) {
    let key = arr[i].path[0];
    let message = arr[i].message;

    if (!errMessage[key]) {
      errMessage[key] = message.replace(/["']/g, '')
    }
  }
  if (errMessage['mobileNumber']) {
    errMessage['mobileNumber'] = 'mobile number must contain numbers only'
  }
  return errMessage;
};
