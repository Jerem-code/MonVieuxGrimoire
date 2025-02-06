const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Route d'inscription
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
