const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    founder: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
