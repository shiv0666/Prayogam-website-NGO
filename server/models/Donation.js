const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Education', 'Social Welfare', 'Environment', 'Healthcare']
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Verified'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
