const express = require("express");
const controller = require("./namespace.controller");
const { multerStorage } = require("../../middlewares/multer");

const uploader = multerStorage("/public/room");

const router = express.Router();

router.route("/").get(controller.getAll).post(controller.createNamespace);

router.route("/room").post(uploader.single("media"), controller.createRoom);

module.exports = router;
