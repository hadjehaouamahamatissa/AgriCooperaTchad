const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Creation d'une commande
exports.createOrder = async (req, res) => {
    try {
        const user = req.user;
        const { items, shippingAddress, payment, notes, desiredDeliveryDate } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Aucun produit dans la commande" });
        }

        let total = 0;
        const produitsAvecDetails = [];

        for (const item of items) {
            const produit = await Product.findById(item.productId);
            if (!produit) return res.status(400).json({ success: false, message: `Produit ${item.productId} non trouvé` });
            if (produit.disponibilite !== "disponible") return res.status(400).json({ success: false, message: `${produit.nom} n'est pas disponible` });
            if (produit.quantite < item.quantity) return res.status(400).json({ success: false, message: `Quantité insuffisante pour ${produit.nom}` });

            const sousTotal = item.quantity * produit.prix;
            total += sousTotal;

            produitsAvecDetails.push({
                produit: produit._id,
                productName: produit.nom,
                quantity: item.quantity,
                unitPrice: produit.prix,
                totalPrice: sousTotal,
                cooperative: produit.cooperative
            });

            produit.quantite -= item.quantity;
            if (produit.quantite === 0) produit.disponibilite = "épuisé";
            await produit.save();
        }

        // Générer un numéro unique de commande
        const generateOrderNumber = () => {
            const datePart = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 12);
            const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires
            return `CMD-${datePart}-${randomPart}`;
        };

        const orderNumber = generateOrderNumber();


        const order = await Order.create({
            orderNumber,
            buyer: user.id,
            cooperative: produitsAvecDetails[0].cooperative,
            items: produitsAvecDetails.map(p => ({
                productId: p.produit,
                productName: p.productName,
                quantity: p.quantity,
                unitPrice: p.unitPrice,
                totalPrice: p.totalPrice
            })),
            totalAmount: total,
            shippingAddress,
            payment, // CORRECTION: payment au lieu de paiement
            notes,
            desiredDeliveryDate
        });

        await order.populate("items.productId", "nom images");
        await order.populate("cooperative", "nom telephone");
        await order.populate("buyer", "nom prenom telephone");

        res.status(201).json({ success: true, message: "Commande créée avec succès", data: { order } });

    } catch (error) {
        console.error("Erreur création commande:", error);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la création de la commande", error: error.message });
    }
};

// Recuperation de la commande d'un utilisateur
exports.getUserOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        let filter = { buyer: req.user.id }; // CORRECTION: buyer au lieu de acheteur
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate("items.productId", "nom images category") // CORRECTION: items.productId au lieu de produits.produit
            .populate("cooperative", "nom region ville")
            .sort({ createdAt: -1 }) // CORRECTION: createdAt au lieu de createAt
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: {
                orders,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération commandes:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération commande",
            error: error.message
        });
    }
};

// Récupération des commandes d'une cooperative
exports.getCooperativeOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        let filter = { cooperative: req.user.cooperative };
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate("items.productId", "nom images category") // CORRECTION: items.productId
            .populate("buyer", "nom prenom telephone adresse") // CORRECTION: buyer au lieu de acheteur
            .sort({ createdAt: -1 }) // CORRECTION: createdAt
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: {
                orders,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        console.error("Erreur récupération commandes coopérative:", error);
        res.status(500).json({
            success: false,
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
        ).populate("items.productId") // CORRECTION: items.productId
            .populate("buyer", "nom prenom telephone"); // CORRECTION: buyer

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Commande non trouvé ou non autorisé"
            });
        }

        res.json({
            success: true,
            message: "Status de commande mis à jour avec succès",
            data: { order }
        });
    } catch (error) {
        console.error("Erreur mis à jour status commande:", error);
        res.status(500).json({
            success: false,
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
            buyer: req.user.id, // CORRECTION: buyer et req.user.id au lieu de req.params.id
            status: { $in: ["pending", "confirmed"] } // CORRECTION: utiliser les valeurs enum correctes
        });

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Commande non trouvé ou ne peut pas etre annulée"
            });
        }

        // Restaurer les quantités des produits
        for (const item of order.items) { // CORRECTION: items au lieu de produits
            await Product.findByIdAndUpdate(item.productId, { // CORRECTION: productId au lieu de produit
                $inc: { quantite: item.quantity }, // CORRECTION: quantity au lieu de quantite
                disponibilite: "disponible"
            });
        }

        order.status = "cancelled"; // CORRECTION: utiliser la valeur enum correcte
        await order.save();

        res.json({
            success: true,
            message: "Commande annulée avec succés",
            data: { order }
        });
    } catch (error) {
        console.error("Erreur annulation commande:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l'annulation de la commande",
            error: error.message
        });
    }
};