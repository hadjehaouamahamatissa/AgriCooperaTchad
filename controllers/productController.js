const Product = require("../models/Product");
const Cooperative = require("../models/Cooperative");

// Recuperer tout les produits
exports.getAllProducts = async (req, res) => {
    try {
        const { category, cooperative, region, bio, page = 1, limit = 12, sort = "createdAt" } = req.query;

        let filter = {isActive: true, disponible: "disponible"};

        if(category) filter.category = category;
        if(cooperative)filter.cooperative = cooperative;
        if(bio !== undefined) filter.bio = bio === "true";

        // filtrer par region via la cooperative
        if(region) {
            const cooperativeInRegion = await Cooperative.find({ region }).select("_id");
            filter.cooperative = {$in: cooperativeInRegion.map(c => c._id)};
        }

        const products = await Product.find(filter)
        .populate("cooperative", "nom region ville")
        .populate("producteur", "nom prenom telephone")
        .limit(limit * 1)
        .skip((page -1) * limit)
        .sort(sort === "prix"? {prix: 1} : {createAt: -1});

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: {
                products,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        console.error("Erreur récupération produits:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des produits",
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate("cooperative", "nom region ville telephone")
        .populate("producteur", "nom prenom telephone adresse")
        .populate("avis.user", "nom prenom");

        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Produit non trouvé"
            });
        }

        res.json({
            success: true,
            data: { product }
        });
    } catch (error) {
        console.error("Erreur récupération produit:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération du produit",
            error: error.message
        });
    }
};

// Creer un produit
exports.createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            producteur: req.user.id,
            cooperative: req.user.cooperative
        };

        // Verification du produit appartenant a une cooperative
        if(!req.user.cooperative) {
            return res.status(400).json({
                success: false,
                message: "Vous devez appartenir a une cooperative pour creer un produit"
            });
        }

        const product = await Product.create(productData);

        //Ajouter un produit a la cooperative
        await Cooperative.findByIdAndUpdate(
            req.user.cooperative,
            { $push: { produits: product._id} }
        );

        res.status(201).json({
            success: true,
            message: "Produit créé avec succés",
            data: { product }
        });
    } catch (error) {
        console.error("Errreur création du produit:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la creation du produit",
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            {_id: req.params.id, producteur: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produit non trouvé ou non autorisé"
            });
        }

        res.json({
            success: true,
            message: "Produit mise à jour avec succès",
            data: { product }
        });
    } catch (error) {
        console.error("Erreur de mise à jour produit:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la mise à jour du produit",
            error: error.message
        });
    }
};

// Ajout d'un avis a un produit
exports.addReview = async (req, res) => {
    try {
        const { note, commentaire } = req.body;

        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Produit non trouvé"        
            });
        }

        // Verification si un utilisateur a déjà noté ce produit
        const existingReview = product.avis.find(avis => 
            avis.user.toString() === req.user.id
        );

        if(!existingReview) {
            return res.status(400).json({
                success: false,
                message: "Vous avez déjà noté ce produit"
            });
        }

        product.avis.push({
            user: req.user.id,
            note,
            commentaire
        });

        // Recalcul des notes moyennes
        const totalNotes = product.avis.reduce((sum, avis) => sum + avis.note, 0);
        product.note = totalNotes / Product.avis.length;
        
        await product.save();

        res.json({
            success: true,
            message: "Avis ajouté avec succès",
            data: { product }
        });
    } catch (error) {
        console.error("Erreur ajout avis:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l\'ajout de l\'avis",
            error: error.message
        });
    }
};