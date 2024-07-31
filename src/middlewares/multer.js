const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.multerStorage = (destination, allowTypes = /png|jpg|jpeg|webp/) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },

    filename: (req, file, cb) => {
      const unique = Date.now() * Math.floor(Math.random() * 999999);

      const ext = path.extname(file.originalname);

      cb(null,`${unique}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("the format file is invalid"));
    }
  };

  const uploader = multer({
    storage,
    limits: {
      fileSize: 512_000_000,
    },
    fileFilter,
  });

  return uploader;
};
