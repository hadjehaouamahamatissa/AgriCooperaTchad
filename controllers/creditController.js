const Credit = require("../models/Credit");
const User = require("../models/User");
const Cooperative = require("../models/Cooperative");

// ➤ Soumettre une demande de crédit
exports.createCreditRequest = async (req, res) => {
  try {
    const { amount, purpose, lender, duration } = req.body;
    const userId = req.user.id; // récupérer l’utilisateur depuis JWT
    const files = req.files || []; // tableau des fichiers uploadés

    if (!amount || !purpose || !lender || !duration) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    const newCredit = new Credit({
      applicant: userId,
      cooperative: req.user.cooperativeId,
      amount: parseFloat(amount),
      purpose,
      lender,
      duration: parseInt(duration),
      documents: files.map(f => ({
        name: f.originalname,
        url: `/uploads/documents/${f.filename}`
      })),
      status: 'SUBMITTED',
      events: [
        { type: "SUBMITTED", by: userId, notes: "Demande soumise", date: new Date() }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedCredit = await newCredit.save();

    res.status(201).json({
      success: true,
      message: "Demande de crédit soumise avec succès",
      data: savedCredit
    });

  } catch (err) {
    console.error("Erreur création crédit:", err);
    res.status(500).json({ message: "Erreur serveur interne", error: err.message });
  }
};


// ➤ Analyste : Mettre à jour l'état d'une demande
exports.reviewCredit = async (req, res) => {
  try {
    const { status, notes } = req.body; // status = "UNDER_REVIEW", "APPROVED" ou "REJECTED"

    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ success: false, message: "Demande introuvable" });

    // Workflow réaliste : une demande doit être SUBMITTED pour être analysée
    if (!["SUBMITTED", "UNDER_REVIEW"].includes(credit.status)) {
      return res.status(400).json({ success: false, message: "Demande non éligible à la revue" });
    }

    credit.status = status;
    credit.events.push({ type: status, by: req.user.id, notes });

    // Si approuvée, enregistrer la date et préparer le plan de remboursement
    if (status === "APPROVED") {
      credit.approvalDate = new Date();
      generateInstallments(credit);
    }

    await credit.save();
    res.json({ success: true, message: `Demande ${status}`, data: credit });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// ➤ Générer les échéances après approbation
function generateInstallments(credit) {
  const installments = [];
  const monthlyRate = 0.01 * 1; // Exemple : 1% par mois, peut être basé sur institution
  const monthlyPayment = credit.amount * monthlyRate * Math.pow(1 + monthlyRate, credit.duration) / (Math.pow(1 + monthlyRate, credit.duration) - 1);
  let remaining = credit.amount;

  for (let i = 1; i <= credit.duration; i++) {
    const interest = remaining * monthlyRate;
    const principal = monthlyPayment - interest;
    installments.push({
      dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
      amount: monthlyPayment,
      principal,
      interest,
      status: "pending"
    });
    remaining -= principal;
  }

  credit.installments = installments;
  credit.remainingAmount = credit.amount;
}

// ➤ Payer une échéance
exports.payInstallment = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit || credit.status !== "APPROVED") return res.status(404).json({ success: false, message: "Crédit non trouvé ou non éligible" });

    const installment = credit.installments.id(req.params.installmentId);
    if (!installment || installment.status === "paid") return res.status(404).json({ success: false, message: "Échéance non trouvée ou déjà payée" });

    installment.status = "paid";
    installment.paymentDate = new Date();
    credit.remainingAmount -= installment.principal;

    // Vérifier si toutes les échéances sont payées
    if (credit.installments.every(i => i.status === "paid")) credit.status = "REPAID";

    await credit.save();
    res.json({ success: true, message: "Échéance payée", data: credit });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// ➤ Récupérer les demandes d'un utilisateur
exports.getUserCredits = async (req, res) => {
  try {
    const credits = await Credit.find({ applicant: req.user.id })
      .populate("cooperative", "name")
      .sort({ createdAt: -1 })

    res.json({ success: true, data: credits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// ➤ Récupérer les demandes d'une coopérative
exports.getCooperativeCredits = async (req, res) => {
  try {
    const credits = await Credit.find({ cooperative: req.user.cooperativeId }).sort({ createdAt: -1 });
    res.json({ success: true, data: credits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

// Récupérer les institutions financières partenaires
exports.getFinancialInstitutions = async (req, res) => {
  try {
    const institutions = [
      { id: "bct", name: "Banque Commercial du Tchad", type: "Banque", rate: "10-15%" },
      { id: "acep", name: "Microfinance ACEP", type: "Microfinance", rate: "8-12%" },
      { id: "fda", name: "Fond de Développement Agricole", type: "Publique", rate: "5-10%" },
      { id: "ecobank", name: "Ecobank Tchad", type: "Banque", rate: "12-18%" },
      { id: "express", name: "Express Union", type: "Microfinance", rate: "9-14%" }
    ];

    res.json({
      success: true,
      data: { institutions }
    });
  } catch (error) {
    console.error("Erreur récupération institutions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des institutions financières",
      error: error.message
    });
  }
};

// Récupérer les statistiques de financement
exports.getFinanceStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalRequests = await Credit.countDocuments({ applicant: userId });
    const approvedRequests = await Credit.countDocuments({ applicant: userId, status: "approved" });
    const pendingRequests = await Credit.countDocuments({ applicant: userId, status: "pending" });

    const totalAmountAgg = await Credit.aggregate([
      { $match: { applicant: userId, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const stats = {
      totalRequests,
      approvedRequests,
      pendingRequests,
      totalAmount: totalAmountAgg.length > 0 ? totalAmountAgg[0].total : 0
    };

    res.json({ success: true, data: { stats } });
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des statistiques",
      error: error.message
    });
  }
};