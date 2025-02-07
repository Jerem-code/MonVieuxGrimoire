const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const optimizeImage = (req, res, next) => {
  if (!req.file) return next();

  sharp(req.file.path)
    .resize(800, 600, { fit: "inside" })
    .jpeg({ quality: 80 })
    .toFile(path.join("images", "optimized_" + req.file.filename))
    .then(() => {
      req.file.filename = "optimized_" + req.file.filename;
      next();
    })
    .catch((error) => next(error));
};

module.exports = {
  upload: multer({ storage: storage }).single("image"),
  optimizeImage,
};
