const tokenExpiry = timeInMins => Date.now() + 1000 * 60 * timeInMins;
module.exports = tokenExpiry;
