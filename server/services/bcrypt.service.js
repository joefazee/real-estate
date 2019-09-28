const bcrypt = require("bcrypt");
const rounds = require("../config").bcryptSalt;

exports.hashPassword = user => {
  const hash = bcrypt.genSaltSync(rounds);
  return bcrypt.hash(user.password, hash);
};

exports.comparePassword = (pw, hash) => bcrypt.compare(pw, hash);
