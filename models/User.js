const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "L\'email est requis"],
    unique: true,
    lowercase: true,
    trim: true
  },
  telephone: {
    type: String,
    required:[true, "Le telephone est requis"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis"],
    minlenght: 6
  },
  role: {
    type: String,
    enum: ["admin", "cooperative", "producteur", "acheteur", "investisseur", "transporteur"],
    default: "producteur"
  },
  cooperative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cooperative"
  },
  adresse: {
    region: String,
    ville: String,
    quartier: String,
    codePostal: String
  },
  profileImage: String,
  isActive: {
    type: Boolean,
    default:true
  },
  is2FAEnabled: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  lastLogin: Date,
  preferences: {
    notification:{ type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  },
}, {
  timestamps: true
});

// Hash du mot de passe avant sauvegarde
// userSchema.pre("save", async function (next) {
//   if(!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Verification du password
// userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
//   return await bcrypt.compare(candidatePassword, userPassword);
  
// };

/// MIDDLEWARE CORRIGÉ POUR HACHER LE MOT DE PASSE
userSchema.pre("save", async function (next) {
  // Vérifier si le mot de passe est modifié ou nouveau
  if (!this.isModified("password")) return next();
  
  try {
    // Hacher avec un salt de 12 rounds
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("✅ Mot de passe haché avec succès");
    next();
  } catch (error) {
    console.error("❌ Erreur hachage mot de passe:", error);
    next(error);
  }
});

// Verification du password
userSchema.methods.correctPassword = async function (candidatePassword, password) {
  return await bcrypt.compare(candidatePassword, password);
};


module.exports = mongoose.model("User", userSchema);