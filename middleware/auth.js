const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; // ✅ ici
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) return res.status(401).json({ message: 'Token invalide. Utilisateur non trouvé.' });

    if (user.status && user.status !== 'active') {
      return res.status(401).json({ message: 'Compte inactif ou suspendu.' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: user.getRolePermissions ? user.getRolePermissions() : []
    };

    next();

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Token invalide.' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expiré.' });
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = auth;
