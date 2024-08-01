const userModel = require("../../models/User");
const { registerValidator, loginValidator } = require("./auth.validator");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, phone, password } = req.body;

    await registerValidator.validate({ username, phone, password });

    const existUser = await userModel.findOne({ username, phone });
    if (existUser) {
      return res.status(400).json({ message: "user exist already" });
    }

    const user = await userModel.create({ username, phone, password });

    const accessToken = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30day",
    });

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 2592000000,
      sameSite: "strict",
    });

    return res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };
  

exports.me = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
