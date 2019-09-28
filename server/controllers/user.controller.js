const _ = require("lodash");
const httpStatus = require("http-status");

const User = require("../models/user.model");
const sendResponse = require("../helpers/response");

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.json(sendResponse(httpStatus.OK, "success!", users, null));
  } catch (err) {
    next(err);
  }
};
