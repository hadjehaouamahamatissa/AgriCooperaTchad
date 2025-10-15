// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/sendMail'); // Import Nodemailer
const { generateOTP } = require('../utils/generateOTP'); // Import génération OTP

// Generer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_123', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Stocker OTP en base
const storeOTP = async (userId, code) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await User.findByIdAndUpdate(userId, {
    otp: {
      code: code,
      expiresAt: expiresAt
    }
  });
};

// Simuler l'envoi SMS (gardé pour compatibilité)
const sendSMS = async (telephone, code) => {
  console.log(`📱 SMS envoyé au ${telephone}: Votre code de vérification est ${code}`);
  return true;
};

// INSCRIPTION - AVEC ENVOI EMAIL OTP
exports.register = async (req, res) => {
  try {
    console.log("📨 Données reçues:", req.body);
    
    const { nom, prenom, email, telephone, password, role, adresse, is2FAEnabled = false } = req.body;

    // Validation basique
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nom, prénom, email et mot de passe sont requis"
      });
    }

    // Verifier si l'utilisateur existe deja
    const existingUser = await User.findOne({
      $or: [{ email }, { telephone }]
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur avec cet email ou téléphone existe déjà"
      });
    }

    // Creation de User
    const user = await User.create({
      nom,
      prenom,
      email,
      telephone: telephone || "",
      password,
      role: role || "user",
      adresse: adresse || "",
      is2FAEnabled: is2FAEnabled || false
    });

    // SI 2FA ACTIVÉ : Générer et envoyer OTP par EMAIL
    if (user.is2FAEnabled) {
      const otpCode = generateOTP(); // Utilise la fonction importée
      await storeOTP(user._id, otpCode);
      
      // Envoyer OTP par EMAIL au lieu de SMS
      const emailResult = await sendOTPEmail(email, otpCode, `${prenom} ${nom}`);
      
      if (!emailResult.success) {
        console.warn("⚠️ Email OTP non envoyé, mais utilisateur créé");
      }

      return res.status(201).json({
        success: true,
        message: "Utilisateur créé. Code de vérification envoyé par email.",
        requiresOTP: true,
        data: {
          user: {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone,
            role: user.role,
            is2FAEnabled: user.is2FAEnabled
          }
        }
      });
    }

    // SI 2FA NON ACTIVÉ : Connexion directe
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          is2FAEnabled: user.is2FAEnabled
        },
        token
      }
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
      error: error.message
    });
  }
};

// LOGIN - AVEC ENVOI EMAIL OTP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Verifier le mot de passe
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    // Verifier si le compte est actif
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Compte inactif, contactez l'administrateur"
      });
    }

    // SI 2FA ACTIVÉ : Générer et envoyer OTP par EMAIL
    if (user.is2FAEnabled) {
      const otpCode = generateOTP(); // Utilise la fonction importée
      await storeOTP(user._id, otpCode);
      
      // Envoyer OTP par EMAIL au lieu de SMS
      const emailResult = await sendOTPEmail(user.email, otpCode, `${user.prenom} ${user.nom}`);
      
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Erreur lors de l'envoi de l'email OTP"
        });
      }

      // Mettre a jour la date de derniere connexion
      user.lastLogin = new Date();
      await user.save();

      return res.json({
        success: true,
        message: "Code de vérification envoyé par email",
        requiresOTP: true,
        email: user.email,
        data: {
          user: {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone
          }
        }
      });
    }

    // SI 2FA NON ACTIVÉ : Connexion directe
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Connexion réussie",
      requiresOTP: false,
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          adresse: user.adresse
        },
        token
      }
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion",
      error: error.message
    });
  }
};

// RENVOYER OTP - AVEC EMAIL
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    const otpCode = generateOTP(); // Utilise la fonction importée
    await storeOTP(user._id, otpCode);
    
    // Envoyer par EMAIL au lieu de SMS
    const emailResult = await sendOTPEmail(user.email, otpCode, `${user.prenom} ${user.nom}`);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'email OTP"
      });
    }

    res.json({
      success: true,
      message: "Nouveau code envoyé par email"
    });
  } catch (error) {
    console.error("Erreur renvoi OTP:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du code",
      error: error.message
    });
  }
};

// Les autres fonctions restent IDENTIQUES :
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email et code OTP requis"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Vérifier si OTP existe et est valide
    if (!user.otp || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: "Aucun code OTP en attente. Veuillez refaire une connexion"
      });
    }

    // Vérifier expiration
    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Code OTP expiré. Veuillez refaire une connexion"
      });
    }

    // Vérifier le code
    if (user.otp.code !== otpCode) {
      return res.status(401).json({
        success: false,
        message: "Code OTP incorrect"
      });
    }

    // OTP VALIDÉ : Générer le token
    const token = generateToken(user._id);

    // Nettoyer l'OTP utilisé
    user.otp = undefined;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Vérification OTP réussie",
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          adresse: user.adresse
        },
        token
      }
    });
  } catch (error) {
    console.error("Erreur vérification OTP:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la vérification",
      error: error.message
    });
  }
};

exports.toggle2FA = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enable } = req.body;

    const user = await User.findByIdAndUpdate(
      userId, 
      { is2FAEnabled: enable },
      { new: true }
    );

    res.json({
      success: true,
      message: `2FA ${enable ? 'activé' : 'désactivé'}`,
      data: {
        is2FAEnabled: user.is2FAEnabled
      }
    });
  } catch (error) {
    console.error("Erreur modification 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification 2FA",
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true
    });
    res.status(200).json({
      success: true,
      message: "Déconnexion réussie"
    });
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la déconnexion",
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    .select("-password")
    .populate("cooperative");

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error("Erreur profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la recuperation du profil",
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, telephone, adresse, preferences },
      { new: true, runValidators: true}
    ).select("-password");

    res.json({
      success: true,
      message: "Profil mis a jour avec succes",
      data: { user }
    });
  } catch (error) {
    console.error("Erreur de mis a jour profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mis a jour du profil",
      error: error.message
    });
  }
};

// Vérification email obligatoire (après inscription)
// Dans votre authController.js - fonction verifyEmail
exports.verifyEmail = async (req, res) => {
  try {
    console.log('📨 verifyEmail appelé avec:', req.body);
    
    const { email, code } = req.body;

    // Validation basique
    if (!email || !code) {
      console.log('❌ Données manquantes - email:', email, 'code:', code);
      return res.status(400).json({
        success: false,
        message: "Email et code OTP requis"
      });
    }

    console.log('🔍 Recherche utilisateur:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    console.log('🔍 OTP utilisateur:', user.otp);
    
    // Vérifier si OTP existe
    if (!user.otp || !user.otp.code) {
      console.log('❌ Aucun OTP en attente');
      return res.status(400).json({
        success: false,
        message: "Aucun code OTP en attente"
      });
    }

    // Vérifier expiration
    if (user.otp.expiresAt < new Date()) {
      console.log('❌ OTP expiré:', user.otp.expiresAt);
      return res.status(400).json({
        success: false,
        message: "Code OTP expiré"
      });
    }

    // Vérifier le code
    if (user.otp.code !== code) {
      console.log('❌ Code incorrect - reçu:', code, 'attendu:', user.otp.code);
      return res.status(401).json({
        success: false,
        message: "Code OTP incorrect"
      });
    }

    console.log('✅ OTP validé - activation du compte');
    
    // Activer le compte
    user.isActive = true;
    user.emailVerified = true;
    user.otp = undefined; // Nettoyer l'OTP
    await user.save();

    // Générer token
    const token = generateToken(user._id);

    console.log('✅ Compte activé avec succès pour:', email);

    res.json({
      success: true,
      message: "Email vérifié avec succès",
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          isActive: user.isActive
        },
        token
      }
    });

  } catch (error) {
    console.error('💥 Erreur verifyEmail:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la vérification",
      error: error.message
    });
  }
};
// Mot de passe oublié
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      
      return res.json({ success: true, message: "Si l'email existe, un code a été envoyé" });
    }

    const otpCode = generateOTP();
    await storeOTP(user._id, otpCode);
    
    await sendOTPEmail(email, otpCode, `${user.prenom} ${user.nom}`);
    console.log('✅ Code OTP envoyé au:', email);
    

    res.json({
      success: true,
      message: "Code de réinitialisation envoyé"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Réinitialisation mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Vérifier OTP
    if (!user.otp || user.otp.code !== code || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Code invalide ou expiré" });
    }

    // Changer mot de passe
    user.password = newPassword;
    user.otp = undefined;
    await user.save();
    console.log('✅ Mot de passe changé pour:', email);
    

    res.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};