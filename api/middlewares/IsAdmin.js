module.exports = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ msg: 'No Authorization was found' });
  }

  const { user_type } = req.token;

  if (user_type !== 'admin') {
    return res.status(401).json({ msg: 'You are not Authorized to perform this operation' });
  }

  next();
};
