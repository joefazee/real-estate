module.exports = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ msg: 'No Authorization was found' });
  }

  const { user_type } = req.token;

  if (user_type !== 'investor') {
    return res.status(401).json({ msg: "You can't perform this operation" });
  }

  next();
};
