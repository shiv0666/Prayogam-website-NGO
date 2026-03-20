const FundLedger = require('../models/FundLedger');

const getLedger = async (req, res, next) => {
  try {
    const entries = await FundLedger.find().sort({ year: -1, category: 1 });
    return res.json(entries);
  } catch (error) {
    return next(error);
  }
};

const createEntry = async (req, res, next) => {
  try {
    const { year, category, amountRaised, amountSpent, description, beneficiariesServed } = req.body;
    const entry = await FundLedger.create({
      year,
      category,
      amountRaised,
      amountSpent,
      description,
      beneficiariesServed
    });
    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
};

const updateEntry = async (req, res, next) => {
  try {
    const { year, category, amountRaised, amountSpent, description, beneficiariesServed } = req.body;
    const entry = await FundLedger.findByIdAndUpdate(
      req.params.id,
      { year, category, amountRaised, amountSpent, description, beneficiariesServed },
      { new: true, runValidators: true }
    );
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    return res.json(entry);
  } catch (error) {
    return next(error);
  }
};

const deleteEntry = async (req, res, next) => {
  try {
    const entry = await FundLedger.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    return res.json({ message: 'Entry deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getLedger, createEntry, updateEntry, deleteEntry };
