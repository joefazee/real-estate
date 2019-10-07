const _ = require("lodash");
const httpStatus = require("http-status");

const User = require("../models/user.model");
const UserQueries = require("../queries/user.query");
const authService = require("../services/auth.service");
const sendResponse = require("../helpers/response");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserQueries.findById(id);

    if(!user) {
      return res.status(httpStatus.UNAUTHORIZED).json(sendResponse(httpStatus.UNAUTHORIZED, "invalid user", null, {user: "invalid user"}));
    }

    const token = await authService.issue(user.toJSON());
    return res.json(sendResponse(httpStatus.OK, "success", user, null, token));
  } catch (err) {
    next(err);
  }
}

exports.editUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    let user = await UserQueries.findById(id);

    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(
          sendResponse(httpStatus.UNAUTHORIZED, "invalid user", null, {
            user: "invalid user"
          })
        );
    }

    user.name = name;
    user.phone = phone;

    user = await user.save();

    const token = await authService.issue(user.toJSON());
    return res.json(sendResponse(httpStatus.OK, "success", user, null, token));
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll();

    return res.json(sendResponse(httpStatus.OK, "success!", users, null));
  } catch (err) {
    next(err);
  }
};
