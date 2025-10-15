
// const Transaction = require('../models/Transaction');

// exports.getUserTransactions = async (req, res) => {
//     try {
//         const transactions = await Transaction.find({ user: req.user.id });
//         res.json(transactions);
//     } catch (err) {
//         res.status(500).json({ msg: 'Erreur serveur' });
//     }
// };

// exports.createTransaction = async (req, res) => {
//     const { montant, type, description } = req.body;
//     try {
//         const transaction = new Transaction({ user: req.user.id, montant, type, description });
//         await transaction.save();
//         res.json(transaction);
//     } catch (err) {
//         res.status(500).json({ msg: 'Erreur serveur' });
//     }
// };
