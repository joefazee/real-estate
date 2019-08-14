const bcrypt = require('bcrypt');

const bcryptService = () => {
  const hashPassword = user => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

		return hash;
	};

  const comparePassword = (pw, hash) => bcrypt.compareSync(pw, hash);

	return {
		hashPassword,
		comparePassword,
	};
};

module.exports = bcryptService;
