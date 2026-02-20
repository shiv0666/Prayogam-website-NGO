const Event = require('../models/Event');
const { isAdminRole } = require('../middleware/auth');

const getEvents = async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (showAll) {
      if (!req.user || !isAdminRole(req.user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const events = await Event.find().sort({ date: 1 });
      return res.json(events);
    }

    const events = await Event.find({ status: 'active' }).sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    return next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, requirements, status } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      requirements,
      status
    });
    return res.status(201).json(event);
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, requirements, status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, requirements, status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(event);
  } catch (error) {
    return next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json({ message: 'Event deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
