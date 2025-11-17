const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cooperative: { type: mongoose.Schema.Types.ObjectId, ref: "Cooperative", required: true },

  amount: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 1 }, // en mois
  purpose: { type: String, required: true },
  lender: { type: String, required: true },
  businessPlan: String,
  collateral: [{ type: String }], // simplifié

  status: {
    type: String,
    enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "DISBURSED", "REPAID"],
    default: "DRAFT"
  },

  events: [
    {
      type: { type: String }, // ex: SUBMITTED, REVIEWED, APPROVED
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
      notes: String
    }
  ],

  approvalDate: Date,
  disbursementDate: Date,
  remainingAmount: Number,
  installments: [
    {
      dueDate: Date,
      amount: Number,
      principal: Number,
      interest: Number,
      status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
      paymentDate: Date
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Credit", creditSchema);
