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

// CORRECTION: validation rules corrigées pour correspondre aux données du frontend
const orderValidation = [
    body("items").isArray({ min: 1}).withMessage("Au moins un produit est requis"),
    body("items.*.productId").isMongoId().withMessage("ID produit invalide"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantité invalide"),
    body("shippingAddress.fullName").notEmpty().withMessage("Nom complet requis"),
    body("shippingAddress.phone").notEmpty().withMessage("Téléphone requis"),
    body("shippingAddress.city").notEmpty().withMessage("Ville requise"),
    body("payment.method").isIn(["mobile_money", "stripe", "cash", "transfer", "cooperative_credit"]).withMessage("Méthode de paiement invalide")
];

// Routes
router.post("/", auth, authorize("acheteur"), orderValidation, handleValidationErrors, createOrder);
router.get("/my-orders", auth, authorize("acheteur"), getUserOrders);
router.get("/cooperative", auth, authorize("cooperative", "producteur"), getCooperativeOrders);
router.put("/:id/status", auth, authorize("cooperative", "producteur"), updateOrderStatus);
router.put("/:id/cancel", auth, authorize("acheteur"), cancelOrder);

module.exports = router;