const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

router.route("/").post(controller.auth);
router.route("/me").get(controller.me);

module.exports = router;
