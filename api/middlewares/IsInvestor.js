module.exports = (req, res, next) => {
  const { user_type } = req.token;

  if (user_type !== 'investor') {
    return res.status(401).json({ msg: "You can't perform this operation" });
  }

  next();
};
