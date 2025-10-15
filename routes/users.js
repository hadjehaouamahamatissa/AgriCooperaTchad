// backend/routes/users.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Exemple route test
router.get("/", (req, res) => {
  res.json({ message: "Liste des utilisateurs" });
});


// Route pour obtenir le profil de l’utilisateur connecté
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.Id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    console.error("Erreur profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;   // ⚠️ très important

