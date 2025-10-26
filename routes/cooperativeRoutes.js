const express = require("express");

const { body } = require("express-validator");
const {
    getAllCooperatives,
    getCooperativeById,
    createCooperative, 
    updateCooperative, 
    addMember,
    getCooperativeStats,
    deleteCooperative
} = require("../controllers/cooperativeController");
const { auth, authorize } = require("../middleware/auth");
const { handleValidationErrors } = require("../middleware/validation");

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
router.get("/:id", getCooperativeById);
router.get("/stats/general", auth, authorize("admin"), getCooperativeStats);

// Routes protegees
router.get("/", getAllCooperatives);
router.post("/", auth, authorize("admin", "cooperative"), cooperativeValidation, handleValidationErrors, createCooperative);
router.put("/:id", auth, authorize("admin", "cooperative"), updateCooperative);
router.post("/:id/members", auth, authorize("admin", "cooperative"), addMember);
router.delete("/:id", auth, authorize("admin"), deleteCooperative);

module.exports = router;