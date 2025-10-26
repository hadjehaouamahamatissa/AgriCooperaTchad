const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Creation d'une commande
exports.createOrder = async (req, res) => {
    try {
        const { produits, adresseLivraison, paiement, notes, dateLivraisonSouhaitee } = req.body;

        // Verification de la disponibilite des produits et calcul total
        let total = 0;
        const produitsAvecDetails = [];

        for (const item of produits) {
            const produit = await Product.findById(item.produit);

            if (!produit) {
                return res.status(400).json({
                    succes: false,
                    message: "Produit ${item.produit} nom trouvé"
                });
            }

            if (produit.disponibilite !== "disponible") {
                return res.status(400).json({
                    succes: false,
                    message: "Produit ${produit.nom} n'est pas disponible"
                });
            }

            if (produit.quantite < item.quantite) {
                return res.status(400).json({
                    succes: false,
                    message: "Quantité insuffisante pour ${produit.nom}"
                });
            }

            const sousTotal = item.quantite * produit.prix;
            total += sousTotal;

            produitsAvecDetails.push({
                produit: produit._id,
                quantite: item.quantite,
                prixUnitaire: produit.prix,
                sousTotal: sousTotal
            });

            //Reduction du quantite disponible
            produit.quantite -= item.quantite;
            if (produit.quantite === 0) {
                produit.disponibilite = "épuisé";
            }
            await produit.save();
        }

        const premierProduit = await Product.findById(produits[0].produit).populate("cooperative");
        const cooperativeId = premierProduit.cooperative._id;

        const order = await Order.create({
            acheteur: req.user.id,
            cooperative: cooperativeId,
            produits: produitsAvecDetails,
            total: total,
            adresseLivraison,
            paiement,
            notes,
            dateLivraisonSouhaitee
        });

        await order.populate("produits.produit", "nom images");
        await order.populate("cooperative", "nom telephone");
        await order.populate("acheteur", "nom prenom telephone");

        res.status(201).json({
            succes: true,
            message: "Commande créée avec succès",
            data: { order }
        });

    } catch (error) {
        console.error("Erreur création commande:", error);
        res.status(500).json({
            succes: false,
            message: "Erreur serveur lors de la création de la commande",
            error: error.message
        });
    }
};

// Recuperation de la commande d'un utilisateur
exports.getUserOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        let filter = { acheteur: req.user.id };
        if(status) filter.status = status;

        const orders = await Order.find(filter)
        .populate("produits.produit", "nom image category")
        .populate("cooperative", "nom region ville")
        .sort({ createAt: -1 })
        .limit(limit * 1)
        .skip((page -1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            succes: true,
            data: {
                orders,
                totalPages: Math.ceil(total/limit),
                currentPage: page,
                total
            } 
        });
    } catch (error) {
        console.error("Erreur lors de la récupération commandes:", error);
        res.status(500).json({
            succes: false,
            message: "Erreur serveur lors de la récupération commande",
            error: error.message 
        });
    }
};

// Récupération des commandes d'une cooperative
exports.getCooperativeOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status} = req.query;

        let filter = { cooperative: req.user.cooperative };
        if(status) filter.status = status;

        const orders = await Order.find(filter)
        .populate("produits.produit", "nom images category")
        .populate("acheteur", "nom prenom telephone adresse")
        .sort({ createAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            succes: true,
            data: {
                orders,
                totalPages: Math.ceil(total/limit),
                currentPage: page,
                total
            }
        });
    } catch(error) {
        console.error("Erreur récupération commandes coopérative:", error);
        res.status(500).json({
            succes: false,
            message: "Erreur serveur lors de la récupération des commandes",
            error: error.message
        });
    }
};

// Mise à jour du status d'une commande
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                cooperative: req.user.cooperative
            },
            { status },
            { new: true, runValidators: true }
        ).populate("produits.produit")
        .populate("acheteur", "nom prenom telephone");

        if(!order) {
            return res.status(404).json({
                succes: false,
                message: "Commande non trouvé ou non autorisé"
            });
        }

        res.json({
            succes: true,
            message: "Status de commande mis à jour avec succès",
            data: { order }
        });
    } catch (error) {
        console.error("Erreur mis à jour status commande:", error);
        res.status(500).json({
            succes: false,
            message: "Erreur serveur lors de la mise a jour du status",
            error: error.message
        });
    }
};

// Annulation du commande
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            acheteur: req.params.id,
            status: { $in: ["en_attente", "confirmée"]}
        });

        if(!order) {
            return res.status(400).json({
                succes: false,
                message: "Commande non trouvé ou ne peut pas etre annulée"
            });
        }

        // Restaurer les quantités des produits
        for (const item of order.produits) {
            await Product.findByIdAndUpdate(item.produit, {
                $inc: { quantite: item.quantite },
                disponibilite: "disponible"
            });
        }

        order.status = "annulée";
        await order.save();

        res.json({
            succes: true,
            message: "Commande annulée avec succés",
            data: { order }
        });
    } catch (error) {
        console.error("Erreur annulation commande:", error);
        res.status(500).json({
            succes: false,
            message: "Erreur serveur lors de l\'annulation de la commande",
            error: error.message
        });
    }
};

