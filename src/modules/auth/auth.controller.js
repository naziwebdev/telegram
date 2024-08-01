const userModel = require("../../models/User");
const { registerValidator, loginValidator } = require("./auth.validator");
const jwt = require("jsonwebtoken");
const bcrybt = require("bcryptjs");

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
    const { identifier, password } = req.body;

    await loginValidator.validate({ identifier, password });

    const user = await userModel.findOne({
      $or: [{ username: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "not found user" });
    }

    const isCorrectpassword = await bcrybt.compare(password, user.password);

    if (!isCorrectpassword) {
      return res
        .status(422)
        .json({ message: "identifier or password is incorrect" });
    }

    const accessToken = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30day",
    });

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 2592000000,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "user login successfully" });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.user._id }, "-password");

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
