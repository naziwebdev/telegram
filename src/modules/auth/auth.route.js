const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/me").get(controller.me);

module.exports = router;
