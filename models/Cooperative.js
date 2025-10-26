const mongoose = require("mongoose");
// const { use } = require("react");

const cooperativeSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: [true, "La region est requise"],
        enum: ["N'Djamena", "Borkou", "Ennedi", "Tibesti", "Batha", "Chari-Baguirmi","Guéra", "Hadjer-Lamis", "Kanem", "Lac", "Logone Occidental", "Logone Oriental", "Mandoul", "Mayo-Kebbi Est", "Mayo-Kebbi Ouest", "Moyen-Chari", "Ouaddaï", "Salamat", "Sila", "Tandjilé", "Wadi Fira"]
    },
    ville: {
        type: String,
        required: [true, "La ville est requise"],
    },
    quartier: String,
    telephone: {
        type: String,
        required: [true, "Le telephone est requis"]
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    dateCreation: {
        type: Date,
        required: true
    },
    president: {
        nom: String,
        telephone: String,
        email: String
    },
    membres: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        prenom: String,
        role: {
            type: String,
            enum: ["president", "tresorier", "membre"],
            default: "membre"
        },
        dateAdhesion: {
            type: Date,
            default: Date.now
        }
    }],
    activites: [{
        type: String,
        enum: ["agriculture", "transformation", "commerce", "transport", "autres"]
    }],
    produits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    statistiques: {
        nombresMembres: { type: Number, default: 0},
        chiffreAffaireAnnuel: { type: Number, default: 0},
        superficieTotal: { type: Number, default: 0} // en hectars
    },
    documents: {
        status: String,
        registreCommerce: String,
        agrement: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    cardinates: {
        latitude: Number,
        longitude: Number
    }
} , {
    timestamps: true
});
// middleware pour mettre a jour le nombre de membres
cooperativeSchema.pre("save", function(next) {
    this.statistiques.nombresMembres = this.membres.length;
    next();
});

// Middleware pour mettre a jour le nombre de membres
cooperativeSchema.pre("save", function (next) {
    this.statistiques.nombresMembres = this.membres.length;
    next();
});

module.exports = mongoose.model("Cooperative", cooperativeSchema);