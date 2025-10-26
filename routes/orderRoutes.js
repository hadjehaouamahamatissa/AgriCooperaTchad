const express = require("express");
const { body } = require("express-validator");
const {
    createOrder,
    getUserOrders,
    getCooperativeOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");
const { auth, authorize } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

// validation rules
const orderValidation = [
    body("produits").isArray({ min: 1}).withMessage("Au moins un produit est requis"),
    body("produits.*.produit").isMongoId().withMessage("ID produit invalide"),
    body("produit.*.quantite").isIn({ min: 1 }).withMessage("Quantite invalide"),
    body("adresseLivraison.nomComplet").notEmpty().withMessage("Nom complet requis"),
    body("adresseLivraison.telephone").notEmpty().withMessage("Téléphone requis"),
    body("adresseLivraison.ville").notEmpty().withMessage("Ville requise"),
    body("paiement.methode").isIn(["mobile_money", "carte_credit", "espece", "virement", "credit_cooperative"]).withMessage("Methode de paiement invalide")
];

// Routes
router.post("/", auth, authorize("acheteur"), orderValidation, handleValidationErrors, createOrder);
router.get("/my-orders", auth, authorize("acheteur"), getUserOrders);
router.get("/cooperative", auth, authorize("cooperative", "producteur"), getCooperativeOrders);
router.put("/:id/status", auth, authorize("cooperative", "producteur"), updateOrderStatus);
router.put("/:id/cancel", auth, authorize("acheteur"), cancelOrder);

module.exports = router;
