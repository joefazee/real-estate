const express = require("express");
const praviteRouter = require("./private");
const publicRouter = require("./public");

const router = express.Router();

router.use("/private", praviteRouter);
router.use("/public", publicRouter);

module.exports = router;
