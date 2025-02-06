const Book = require("../models/Book");

module.exports = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Requête non autorisée" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
