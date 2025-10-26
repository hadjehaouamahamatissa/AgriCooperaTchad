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
  updateProfile,
  logout
} = require('../controllers/authController');
const { auth } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");
// const Cooperative = require("../controllers/cooperativeController");
// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);      // Vérification email après inscription
router.post('/verify-otp', verifyOTP);          // Vérification OTP 2FA
router.post('/resend-otp', resendOTP);          // Renvoyer OTP
router.post('/forgot-password', forgotPassword); // Mot de passe oublié
router.post('/reset-password', resetPassword);   // Réinitialisation mot de passe

// Routes protégées
// Routes profile - DÉFINIES DIRECTEMENT
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);


module.exports = router;