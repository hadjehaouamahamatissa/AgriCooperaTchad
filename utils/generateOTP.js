const crypto = require('crypto');

// Générer OTP de 6 chiffres sécurisé
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

module.exports = {
  generateOTP
};