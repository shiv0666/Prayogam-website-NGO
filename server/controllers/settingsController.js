const Settings = require('../models/Settings');

const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    return res.json(settings);
  } catch (error) {
    return next(error);
  }
};

const upsertSettings = async (req, res, next) => {
  try {
    const { name, founder, address, contact, location, domain } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      { name, founder, address, contact, location, domain },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json(settings);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getSettings, upsertSettings };
