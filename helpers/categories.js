module.exports = (req, res, next) => {
  const selectedCategories = req.body.name.split(',');

  const categories = selectedCategories.map((category, index) => {
    if (index === selectedCategories.length - 1) return `name = '${category.trim()}'`;
    console.log(category);
    return `name = '${category.trim()}' OR`;
  });
  req.selectedCategories = categories.join(' ');
  next();
};
