module.exports = () => {
  const currentDate = new Date();
  const oneWeekBack = currentDate.getDate() - 7;
  return currentDate.setDate(oneWeekBack);
};
