// backend/routes/users.js - TOUT DANS UN SEUL FICHIER
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const User = require("../models/User");

// Route pour obtenir l'utilisateur connecté
router.get("/profile", auth, async (req, res) => {
  try {
    console.log("🔍 Récupération utilisateur connecté:", req.user.id);
    
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("cooperativeId", "nom region ville");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    console.log("✅ Utilisateur trouvé:", user.email, "Coop ID:", user.cooperativeId);

    res.json({ 
      success: true,
      data: user
    });
  } catch (error) {
    console.error("❌ Erreur getCurrentUser:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
});

// Route pour obtenir TOUS les utilisateurs (admin)
router.get("/", auth, async (req, res) => {
  try {
    // Seul l'admin peut voir tous les utilisateurs
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Accès non autorisé" 
      });
    }
    
    const users = await User.find().select("-password");
    res.json({ 
      success: true,
      data: users 
    });
  } catch (error) {
    console.error("❌ Erreur getAllUsers:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
});

// Route pour obtenir un utilisateur spécifique
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }
    res.json({ 
      success: true,
      data: user 
    });
  } catch (error) {
    console.error("❌ Erreur getUserById:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur" 
    });
  }
});

module.exports = router;