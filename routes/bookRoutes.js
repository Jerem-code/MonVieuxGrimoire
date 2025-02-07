const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book");
const checkBookOwner = require("../middleware/checkBookOwner");
const { upload, optimizeImage } = require("../middleware/multer-config");

// Routes publiques
router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);

// Routes protégées
router.post("/", auth, upload, optimizeImage, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);
router.put(
  "/:id",
  auth,
  checkBookOwner,
  upload,
  optimizeImage,
  bookCtrl.updateBook
);
router.delete("/:id", auth, checkBookOwner, bookCtrl.deleteBook);

module.exports = router;
