const express = require("express");

const { body } = require("express-validator");
const {
    getAllCooperatives,
    getCooperativeById,
    createCooperative,
    updateCooperative,
    addMember,
    getCooperativeStats
} = require("../controllers/cooperativeController");
const { auth, authorize } = require("../middleware/auth");
const { handleValidationErros } = require("../middleware/validation");

const router = express.Router();

// Validation rules
const cooperativeValidation = [
    body("nom").notEmpty().withMessage("Le nom est requis"),
    body("description").notEmpty().withMessage("La description est requis"),
    body("region").notEmpty().withMessage("Le région est requis"),
    body("ville").notEmpty().withMessage("La ville est requis"),
    body("telephone").notEmpty().withMessage("Le téléphone est requis"),
    body("dateCreation").isISO8601().withMessage("Date de création invalide")
];

// Routes publiques
router.get("/", getAllCooperatives);
router.get("/:id", getCooperativeById);

// Routes protegees
router.post("/", auth, authorize("admin", "cooperative"), cooperativeValidation, handleValidationErros, createCooperative);
router.put("/:id", auth, authorize("admin", "cooperative"), updateCooperative);
router.post("/:id/members", auth, authorize("admin", "cooperative"), addMember);
router.get("/stats/general", auth, authorize("admin"), getCooperativeStats);

module.exports = router;