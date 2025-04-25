const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./Routes/routes');

const app = express();
const PORT = 3000;

// ✅ CORS en premier
app.use(cors({
  origin: '*', // ou spécifie ton IP locale : 'http://192.168.11.196:8080'
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
