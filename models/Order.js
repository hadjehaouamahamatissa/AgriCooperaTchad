// models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    used: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index pour la suppression automatique des OTP expirés
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthode pour vérifier si l'OTP est valide
otpSchema.methods.isValid = function() {
    return !this.used && this.expiresAt > new Date() && this.attempts < 5;
};

module.exports = mongoose.model('Otp', otpSchema);