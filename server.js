const http = require("http");
const app = require("./app");
require("dotenv").config();

// Définition du port
const port = process.env.PORT || 4000;

// Création du serveur
const server = http.createServer(app);

// Gestion des erreurs du serveur
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Le port ${port} est déjà utilisé`);
  } else {
    console.error(`Erreur du serveur:`, error);
  }
  process.exit(1);
});

// Démarrage du serveur
server.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
