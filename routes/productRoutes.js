const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    addReview
} = require("../controllers/productController")
const {auth, authorize } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const productValidation = [
    body("nom").notEmpty().withMessage("Le nom du produit est requis"),
    body("category").notEmpty().withMessage(["légumes", "légumineux", "fruits", "betails", "autres"]).withMessage("Catégorie invalide"),
    body("prix").isFloat({ min: 0 }).withMessage("Prix invalide"),
    body("quantite").isInt({ min: 0 }).withMessage("Quantité invalide"),
    body("unite").notEmpty().isIn(["kg", "g", "litre", "piéce", "carton", "autre"]).withMessage("Unité invalide")
];

const reviewValidation = [
    body("note").isInt({ min: 1, max: 5 }).withMessage("La note doit etre entre 1 et 5"),
    body("commantaire").optional().isLength({ max: 500 }).withMessage("Le commentaire ne doit pas depasser 500 caracteres")
];

// Routes publiques
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Routes protégées
router.post("/", auth, authorize("producteur", "admin"), productValidation, handleValidationErrors, createProduct);
router.put("/:id", auth, authorize("producteur"), productValidation, handleValidationErrors, updateProduct);
router.post("/:id/reviews", auth, authorize("acheteur"), reviewValidation, handleValidationErrors, addReview);

module.exports = router;
