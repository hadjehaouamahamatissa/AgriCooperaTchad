const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// ✅ CORRECTION CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware de sécurité
app.use(helmet());

// Body parser
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de debug
app.use((req, res, next) => {
  console.log(`\n📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body reçu:', req.body);
  }
  next();
});

// Import des routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use('/api/cooperatives', require('./routes/cooperativeRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/credits', require('./routes/creditRoutes'));
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// const userRoutes = require("./routes/users");
// const cooperativeRoutes = require("./routes/cooperativeRoutes");

// app.use("/api/cooperatives", cooperativeRoutes);


// Route de santé
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AgriCooperaTchad est en ligne",
    timestamp: new Date().toISOString()
  });
});


// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('💥 Erreur globale:', err.message);
  res.status(500).json({
    success: false,
    message: "Erreur serveur interne"
  });
});

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/agricoopera";
mongoose.connect(MONGODB_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 ==================================`);
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend: http://localhost:5173`);
  console.log(`🌱 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`🚀 ==================================\n`);
});

module.exports = app;