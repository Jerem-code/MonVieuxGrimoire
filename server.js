const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Votre serveur fonctionne correctement!" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = app;
