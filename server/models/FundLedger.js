const mongoose = require('mongoose');

const fundLedgerSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100
    },
    category: {
      type: String,
      required: true,
      enum: ['Education', 'Social', 'Environment', 'Healthcare', 'Administration', 'Other']
    },
    amountRaised: { type: Number, required: true, min: 0, default: 0 },
    amountSpent: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, trim: true, default: '' },
    beneficiariesServed: { type: Number, min: 0, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FundLedger', fundLedgerSchema);
