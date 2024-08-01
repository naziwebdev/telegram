const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const namespaceRouter = require("./modules/namespace/namespace.route");
const authRouter = require("./modules/auth/auth.route");

const app = express();

/*Cors Plicy*/

/*Body Parser*/
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

/*Cookie parser*/

app.use(cookieParser());

/*Static Files*/
app.use(express.static(path.join(__dirname, "..", "public")));

/*Routes*/

app.use("/namespaces", namespaceRouter);
app.use("/auth", authRouter);

/*404 Error Handler*/
app.use((req, res) => {
  console.log("this path not found", req.path);
  return res.status(404).json({ message: "this path not found" });
});

/*Global Error Eandler*/

module.exports = app;
