const Content = require('../models/Content');

const getContent = async (req, res, next) => {
  try {
    const { key } = req.params;
    const content = await Content.findOne({ key });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    return res.json(content);
  } catch (error) {
    return next(error);
  }
};

const upsertContent = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { title, body } = req.body;

    const content = await Content.findOneAndUpdate(
      { key },
      { title, body },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(content);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getContent, upsertContent };
