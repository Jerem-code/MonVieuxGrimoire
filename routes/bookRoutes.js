const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book");
const checkBookOwner = require("../middleware/checkBookOwner");
const multer = require("../middleware/multer-config");

// Route publique - Récupérer tous les livres
router.get("/", bookCtrl.getAllBooks);

// Route publique - Récupérer un livre spécifique
router.get("/:id", bookCtrl.getOneBook);

// Route publique - Obtenir les meilleurs livres
router.get("/bestrating", bookCtrl.getBestRatedBooks);

// Routes protégées
router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, checkBookOwner, multer, bookCtrl.updateBook);
router.delete("/:id", auth, checkBookOwner, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
