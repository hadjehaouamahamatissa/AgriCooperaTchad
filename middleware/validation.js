const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.jsEmpty()) {
        return res.status(400).json({
            success: false,
            messsage: "Erreur de validation",
            errors: errors.array()
        });
    }
    next();
};

module.exports = { handleValidationErrors };
// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//       // Récupère le token depuis l'en-tête Authorization : "Bearer <token>"  
//     const authHeader = req.headers["autorization"];
//     if (!authHeader) {
//         return res.status(401).json({ message: "Token manquant" });
//     }

//     const token = authHeader.split(" ")[1]; // Supposant prendre la partie apres "Bearer <token>"

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
//         req.user = decoded;  // Recuperation des informations {userId, role, permissions} plus tard
//         next(); // passer a la route suivant
//     } catch (err) {
//         return res.status(401).json({ message: "Token invalide", error: err.message });

//     }
// };

// module.exports = authMiddleware;
