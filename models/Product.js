const mongoose = require("mongoose");
//const cooperative = require("./cooperative");


const productSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis"],
        trim: true
    },
    description: String,
    category: {
        type: String,
        required: String,
        enum: ["céréales", "légumes", "légumineux", "fruits", "betails", "autres"],
    },
    sousCategory: String,
    cooperative: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cooperative",
        required: true
    },
    producteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    prix: {
        type: Number,
        required: [true, "Le prix est requis"],
        min: 0
    },
    unite: {
        type: String,
        required: true,
        enum: ["kg", "g", "litre", "pièce", "carton", "autre"]
    },
    quantite: {
        type: Number,
        required: true,
        min: 0
    },
    quantiteMin: {
        type: Number,
        default: 1
    },
    images: [String],
    saison: {
        type: String,
        enum: ["tout l\'année", "saison sèche", "saison des pluies", "hivernage"]
    },
    bio: {
        type: Boolean,
        default: false
    },
    certifications: [String],
    disponiblilite: {
        type: String,
        enum: ["disponible", "'bientôt", "épuisé"],
        default: "disponible"
    },
    delaiLivraison: {
        type: Number,
        default: 3
    }, // en jours
    note: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    avis: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: { type: Number, min: 1, max: 5 },
        commentaire: String,
        date: { type: Date, default: Date.now },
    }],
    tags: [String],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);