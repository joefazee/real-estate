const OTPQuery = require('../queries/otp.queries');

async function validateToken(id, token) {
  const otpDetails = await OTPQuery.findByUserID(id);

  return (
    otpDetails &&
    otpDetails.password === token &&
    new Date() < new Date(otpDetails.expiry)
  );
}

module.exports = validateToken;
