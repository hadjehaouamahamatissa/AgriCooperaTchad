const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/upload");
const creditController = require("../controllers/creditController");
const { auth, authorize, isAuthenticated, isAnalyst } = require("../middleware/auth");

// ---------------------------
// ROUTES CRÉDIT UTILISATEUR
// ---------------------------
// router.post('/credits', upload.array('documents'), creditController.createCreditRequest);



// Route pour soumission de crédit avec fichiers
// router.post('/credits', upload.array('documents'), creditController.createCreditRequest);


// Soumettre une demande de crédit
router.post("/", auth, authorize("admin"), upload.array('documents'), creditController.createCreditRequest);


// Récupérer toutes les demandes de l’utilisateur connecté
router.get("/", auth, authorize("admin", "cooperative"), isAuthenticated, creditController.getUserCredits);

// Payer une échéance spécifique
router.post("/:id/installments/:installmentId/pay", isAuthenticated, creditController.payInstallment);


// ---------------------------
// ROUTES CRÉDIT COOPÉRATIVE
// ---------------------------

// Récupérer toutes les demandes de crédit pour la coopérative de l’utilisateur
router.get("/cooperative", isAuthenticated, creditController.getCooperativeCredits);

// ANALYSTE : Revue / approbation / rejet d’une demande
router.put("/cooperative/:id/review", isAuthenticated, isAnalyst, creditController.reviewCredit);


// ---------------------------
// ROUTES INSTITUTIONS FINANCIÈRES & STATISTIQUES
// ---------------------------

// Liste des institutions financières partenaires
router.get("/finance/institutions", auth, authorize("admin"), isAuthenticated, creditController.getFinancialInstitutions);

// Statistiques financières de l’utilisateur
router.get("/finance/stats", auth, authorize("admin"), isAuthenticated, creditController.getFinanceStats);

module.exports = router;
