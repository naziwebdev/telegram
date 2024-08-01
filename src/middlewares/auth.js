const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];

    if (!token) {
      return res.status(404).json({ message: "not found token" });
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (!payload) {
      return res.status(409).json({ message: "token is invalid" });
    }

    const user = await userModel.findOne({ _id: payload.userID }).lean();
    if (!user) {
      return res.status(404).json({ message: "not found user" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
