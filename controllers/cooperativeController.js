const Cooperative = require("../models/Cooperative");
const User = require("../models/User");
const Product = require("../models/Product");

// Recuperer toutes les coop
exports.getAllCooperatives = async (req, res) => { 
    try {
        const { region, activite, page = 1, limit = 10 } = req.query;

        let filter = { isActive: true };

        if (region) filter.region = region;
        if (activite) filter.activites = activite;

        const cooperatives = await Cooperative.find(filter)
            .populate("membres.user", "nom prenom email telephone")
            .populate("produits")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Cooperative.countDocuments(filter);

        res.json({
            success: true,
            data: {
                cooperatives,
                totalPages: Math.ceil(total / limit),
                currentPage: page, 
                total
            }
        });
    } catch (error) {
        console.error("Erreur récupération coopératives:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération des coopératives",
            error: error.message
        });
    }
};

// Mise à jour d'une cooperative
exports.updateCooperative = async (req, res) => { 
    try {
        const cooperative = await Cooperative.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!cooperative) {
            return res.status(404).json({
                success: false,
                message: "Coopérative non trouvée"
            });
        }

        res.json({
            success: true,
            message: "Coopérative mise à jour avec succès",
            data: { cooperative }
        });
    } catch (error) {
        console.error("Erreur mise à jour coopérative:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la mise à jour de la coopérative",
            error: error.message
        });
    }
};

exports.getCooperativeStats = async (req, res) => {
    try {
        const stats = await Cooperative.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalCooperatives: { $sum: 1 },
                    totalMembres: { $sum: "$statistiques.nombreMembres" },
                    moyenneMembres: { $avg: "$statistiques.nombreMembres" },
                    chiffreAffaireTotal: { $sum: "$statistiques.chiffreAffaireAnnuel" }
                }
            }
        ]);

        const statsParRegion = await Cooperative.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$region",
                    nombreCooperatives: { $sum: 1 },
                    nombreMembres: { $sum: "$statistiques.nombreMembres" }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                general: stats[0] || {},
                parRegion: statsParRegion
            }
        });
    } catch (error) {
        console.error("Erreur statistiques:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors du calcul des statistiques",
            error: error.message
        });
    }
};

// Les coop identr une cooperative par ID
exports.getCooperativeById = async (req, res) => {
    try {
        const cooperative = await Cooperative.findById(req.params.id)
            .populate("membres.user", "nom prenom email telephone role")
            .populate("produits");

        if (!cooperative) {
            return res.status(404).json({
                success: false,
                message: "Cooperative non trouvée"
            });
        }

        res.json({
            success: true,
            data: { cooperative }
        });
    } catch (error) {
        console.error("Erreur récupération coopérative:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la récupération de la coopérative",
            error: error.message
        });
    }
};

// Creer une cooperative
exports.createCooperative = async (req, res) => {
    try {
        const cooperativeData = req.body;

        // Verifier si une cooperative avec le meme nom existe deja
        const existingCooperative = await Cooperative.findOne({
            nom: cooperativeData.nom
        });

        if (existingCooperative) {
            return res.status(400).json({
                success: false,
                message: "Une coopérative avec ce nom existe deja"
            });
        }

        const cooperative = await Cooperative.create(cooperativeData);

        res.status(201).json({
            success: true,
            message: "Coopérative créée avec succès",
            data: { cooperative }
        });
    } catch (error) {
        console.error("Erreur création coopérative:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la création de la coopérative",
            error: error.message
        });
    }
};

// Mettre a jour une cooperative
exports.updateCooperative = async (req, res) => {
    try {
        const cooperative = await Cooperative.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!cooperative) {
            return res.status(404).json({
                success: false,
                message: "Coopérative non trouvée"
            });
        }

        res.json({
            success: true,
            message: "Coopérative mise à jour avec succés",
            data: { cooperative }
        });
    } catch (error) {
        console.error("Erreur mise à jour coopérative:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la mise à jour de la coopérative",
            error: error.message
        });
    }
};

// Ajouter un membre a une cooperative
exports.addMember = async (req, res) => {
    try {
        const { email, nom, prenom, role, telephone, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            // Crée l'utilisateur s'il n'existe pas
            user = await User.create({
                nom,
                prenom: "hawa",
                email,
                role: role || "membre",
                telephone: "00000000",
                password
            });
        }

        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Utilisateur non trouvé"
        //     });
        // }

        const cooperative = await Cooperative.findById(req.params.id);
        if (!cooperative) {
            return res.status(404).json({
                success: false,
                message: "Coopérative non trouvée"
            });
        }

        // Verifier si l'utilisateur est deja membre
        const isAlreadyMember = cooperative.membres.some(membre =>
            membre.user.toString() === user._id.toString()
        );

        if (isAlreadyMember) {
            return res.status(400).json({
                success: false,
                message: "Cet utilisateur est déja membre de la coopérative"
            });
        }

        cooperative.membres.push({
            user: user._id,
            role: role || "membre"
        });

        await cooperative.save();

        // Mettre a jour le champ cooperative de l'utilisateur

        user.cooperative = cooperative._id;
        await user.save();

        res.json({
            success: true,
            message: "Membre ajouté avec succès",
            data: { cooperative }
        });
    } catch (error) {
        console.error("Erreur ajout membre:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l\'ajout du membre",
            error: error.message
        });
    }
};

// Statistique des cooperatives
exports.getCooperativeStats = async (req, res) => {
    try {
        const stats = await Cooperative.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalCooperatives: { $sum: 1 },
                    totalMembres: { $sum: "$statistiques.nombreMembre" },
                    moyenneMembres: { $avg: "$statistique.nombresMembres" },
                    chiffreAffaireTotal: { $sum: "$statistiques.chiffreAffaireAnnuel" }
                }
            }
        ]);

        const statsParRegion = await Cooperative.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$region",
                    nombreCooperatives: { $sum: 1 },
                    nombreMembres: { $sum: "$statistiques.nombreMembres" }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                general: stats[0] || {},
                parRegion: statsParRegion
            }
        });
    } catch (error) {
        console.error("Erreur statistiques:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors du calcul des statistiques",
            error: error.message
        });
    }
};

exports.deleteCooperative = async (req, res) => {
    try {
        const { id } = req.params;

        const cooperative = await Cooperative.findById(id);
        if (!cooperative) {
            return res.status(404).json({ message: "Coopérative non trouvée." });
        }

        await Cooperative.findByIdAndDelete(id);

        res.status(200).json({ message: "Coopérative supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};


