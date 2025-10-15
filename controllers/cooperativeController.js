const Cooperative = require("../models/cooperative");
const User = require("../models/User");
const Product = require("../models/Product");

// Recuperer toutes les coop
exports.getAllCooperative = async (req, res) => {
    try {
        const { region, activite, page = 1, limit = 10 } = req.query;

        let filter = { isActive: true };

        if(region) filter.region = region;
        if(activite) filter.activites = activite;

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
                currentPagr: page,
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

// Recuperer une cooperative par ID
exports.getCooperativeById = async (req, res) => {
    try {
        const cooperative = await Cooperative.findById(req.params.id)
          .populate("membres.user", "nom prenom email telephone role")
          .populate("produits");
        
        if(!cooperative) {
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
    }  catch (error) {
        console.error("Erreur création coopérative:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la création de la coopérative",
            error: error.message
        });
    }
};

// Mettre a jour une cooperative
exports.updateCoopérative = async (req, res) => {
    try {
        const cooperative = await Cooperative.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if(!cooperative) {
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
        const { userId, role } = req.body;
        
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        const cooperative = await Cooperative.findById(req.params.id);
        if(!cooperative) {
            return res.status(404).json({
                success: false,
                message: "Coopérative non trouvée"
            });
        }

        // Verifier si l'utilisateur est deja membre
        const isAlreadyMember = cooperative.membres.some(membre => 
            membre.user.toString() === userId
        );

        if(isAlreadyMember) {
            return res.status(400).json({
                success: false,
                message: "Cet utilisateur est déja membre de la coopérative"
            });
        }

        cooperative.membres.push({
            user: userId,
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
                    totalCooperatives: { $num: 1 },
                    totalMembres: { $sum: "$statistiques.nombreMembre"},
                    moyenneMembres: { $avg: "$statistique.nombresMembres"},
                    chiffreAffaireTotal: { $num: "$statistiques.chiffreAffaireAnnuel"}
                }
            }
        ]);

        const statsParRegion = await Cooperative.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$region",
                    nombreCooperatives: { $sum: 1 },
                    nombreMembres: { $num: "$statistiques.nombreMembres" }
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
    }   catch (error) {
        console.error("Erreur statistiques:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors du calcul des statistiques",
            error: error.message
        });
    }
};


// const Cooperative = require('../models/cooperative');

// exports.getAllCooperatives = async (req, res) => {
//     try {
//         const cooperatives = await Cooperative.find().populate('membres', 'nom prenom');
//         res.json(cooperatives);
//     } catch (err) {
//         res.status(500).json({ msg: 'Erreur serveur' });
//     }
// };

// exports.createCooperative = async (req, res) => {
//     const { nom, localisation, description } = req.body;
//     try {
//         const coop = new Cooperative({ nom, localisation, description });
//         await coop.save();
//         res.json(coop);
//     } catch (err) {
//         res.status(500).json({ msg: 'Erreur serveur' });
//     }
// };
