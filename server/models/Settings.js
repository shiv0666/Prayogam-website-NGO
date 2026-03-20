const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    founder: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    facebook: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    youtube: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    whatsapp: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
