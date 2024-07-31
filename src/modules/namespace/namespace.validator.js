const yup = require("yup");

exports.namespaceValidator = yup.object({
  title: yup.string().required("title is required"),
  href: yup.string().required("href is required"),
});
