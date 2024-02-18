const multer = require("multer");

const uploadImage = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    console.log("Multer body", req.body, "Multer file", file);

    if (
      !file ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG/JPEG/JPG images are allowed"));
    }
  },
}).single("image");

module.exports = uploadImage;
