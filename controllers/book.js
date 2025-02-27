const Book = require("../models/Book");

// Récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Créer un nouveau livre
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un livre spécifique
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Modifier un livre
exports.updateBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer les livres les mieux notés
exports.getBestRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res) => {
  // Vérification plus stricte de l'authentification et des données
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié" });
  }

  const { rating } = req.body;

  // Validation de la note
  if (rating === undefined || rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Note invalide" });
  }

  const userId = req.auth.userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérification si l'utilisateur a déjà noté ce livre
      const userRating = book.ratings.find((r) => r.userId === userId);
      if (userRating) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre" });
      }

      // Ajouter la nouvelle note
      book.ratings.push({ userId, grade: rating });

      // Calculer la nouvelle moyenne
      const totalRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating =
        Math.round((totalRatings / book.ratings.length) * 10) / 10;

      return book.save();
    })
    .then((updatedBook) => res.status(200).json(updatedBook))
    .catch((error) => res.status(500).json({ error: error.message }));
};
