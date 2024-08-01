const express = require("express");
const controller = require("./auth.controller");
const auth = require('../../middlewares/auth')

const router = express.Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/me").get(auth ,controller.me);

module.exports = router;
