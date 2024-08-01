const yup = require("yup");

exports.loginValidator = yup.object({
  identifier: yup
    .string()
    .required("this field is required")
    .min(3, "must be 3 char at least"),
  password: yup
    .string()
    .required("this field is required")
    .min(6, "must be 6 char at least")
    .max(20, "must be max 20 char")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "password must be includes small & capital char & numbers"
    ),
});
exports.registerValidator = yup.object({
  username: yup
    .string()
    .required("this field is required")
    .min(3, "must be 3 char at least"),
  phone: yup
    .string()
    .required("this field is required")
    .matches(/^[0-9]{11}$/),
  password: yup
    .string()
    .required("this field is required")
    .min(6, "must be 6 char at least")
    .max(20, "must be max 20 char")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "password must be includes small & capital char & numbers"
    ),
});
