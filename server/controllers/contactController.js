const ContactMessage = require('../models/ContactMessage');

const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const contact = await ContactMessage.create({ name, email, message });
    return res.status(201).json({ message: 'Message received', contact });
  } catch (error) {
    return next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
};

module.exports = { submitContact, getMessages };
