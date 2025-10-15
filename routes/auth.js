const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  verifyOTP, 
  resendOTP, 
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const auth = require("../middleware/auth");

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);      // Vérification email après inscription
router.post('/verify-otp', verifyOTP);          // Vérification OTP 2FA
router.post('/resend-otp', resendOTP);          // Renvoyer OTP
router.post('/forgot-password', forgotPassword); // Mot de passe oublié
router.post('/reset-password', resetPassword);   // Réinitialisation mot de passe

// Routes protégées
router.get('/profile', auth, getProfile);        // Profil utilisateur
router.put('/profile', auth, updateProfile);     // Modifier profil
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Deconnexion reussie' });
});


module.exports = router;