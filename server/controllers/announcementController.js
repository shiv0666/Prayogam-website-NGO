const Announcement = require('../models/Announcement');
const { isAdminRole } = require('../middleware/auth');

const getAnnouncements = async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (showAll) {
      if (!req.user || !isAdminRole(req.user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const announcements = await Announcement.find().sort({ date: -1 });
      return res.json(announcements);
    }

    const announcements = await Announcement.find().sort({ date: -1 });
    return res.json(announcements);
  } catch (error) {
    return next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, date } = req.body;
    const announcement = await Announcement.create({ title, message, date });
    return res.status(201).json(announcement);
  } catch (error) {
    return next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, message, date } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, message, date },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    return res.json(announcement);
  } catch (error) {
    return next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    return res.json({ message: 'Announcement deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
