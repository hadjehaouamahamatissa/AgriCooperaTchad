const Product = require("../models/Product");
const Cooperative = require("../models/cooperative");

// Recuperer tous les produits
exports.getAllProducts = async (req, res) => {
    try{
        const { category, cooperative, region, bio, page = 1, limit = 12, sort = "createAt" } = req.query;

        let filter = {isActive: true, desponible: "desponible"};

        if (category) filter.category = category;
        if (cooperative) filter.cooperative = cooperative;
        if (bio !== undefined) filter.bio = bio === "true";

        // Filtre par region via cooperative
        if(region) {
            const cooperativesInRegion = await Cooperative.find({ region }).select("_id");
            filter.cooperative = { $in: cooperativesInRegion.map(c => c._id) };
        }

        
    }
    
}

// const Product = require('../models/Product');

// exports.getAllProducts = async (req, res) => {
//     try {
//         const products = await Product.find().populate('cooperative', 'nom');
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ msg: 'Erreur serveur' });
//     }
// };

// exports.createProduct = async (req, res) => {
//     const { nomProduit, cooperative, quantite, prix } = req.body;
//     try {
//         const product = new Product({ nomProduit, cooperative, quantite, prix });
//         await product.save();
//         res.json(product);
//     } catch (err) {
//         res.status(500).json({ msg: 'Erreur serveur' });
//     }
// };
