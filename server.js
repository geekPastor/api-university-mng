const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./Routes/routes');
require('dotenv').config(); // 🔑 Pour charger les variables d’environnement

const app = express();
const PORT = process.env.PORT || 3000; // 🔁 Utilise la variable d'env PORT si définie

// ✅ CORS en premier
app.use(cors({
  origin: '*', // 🔁 En production, remplace par l’URL de ton frontend si besoin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🧠 Parse les requêtes JSON
app.use(bodyParser.json());

// 🚀 Routes API
app.use('/api', studentRoutes);

// ✅ Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
