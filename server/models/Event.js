const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
  {
    volunteersNeeded: {
      type: Number,
      min: 0,
      default: 0
    },
    fundsNeeded: {
      type: Number,
      min: 0,
      default: 0
    },
    itemsNeeded: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    requirements: {
      type: requirementSchema,
      default: () => ({})
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    image: { type: String, trim: true, default: '' },
    totalVolunteersRequired: {
      type: Number,
      min: 0,
      default: 0
    },
    currentApprovedVolunteers: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
