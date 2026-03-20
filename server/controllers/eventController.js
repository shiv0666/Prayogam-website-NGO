const Event = require('../models/Event');
const { isAdminRole } = require('../middleware/auth');
const { withEventSlots } = require('../utils/eventSlots');
const { parsePagination, buildPaginatedResponse, getStartDateByRange } = require('../utils/pagination');

const getEvents = async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (showAll) {
      if (!req.user || !isAdminRole(req.user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { page, limit, skip } = parsePagination(req.query);
      const { search = '', status = '', dateRange = 'all', sort = 'date_desc' } = req.query;

      const filter = {};

      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { description: regex }, { location: regex }];
      }

      if (status && ['active', 'inactive'].includes(status)) {
        filter.status = status;
      }

      const rangeStart = getStartDateByRange(dateRange);
      if (rangeStart) {
        filter.date = { $gte: rangeStart };
      }

      const sortMap = {
        date_desc: { date: -1 },
        date_asc: { date: 1 },
        created_desc: { createdAt: -1 },
        created_asc: { createdAt: 1 }
      };

      const sortBy = sortMap[sort] || sortMap.date_desc;

      const [events, totalItems] = await Promise.all([
        Event.find(filter).sort(sortBy).skip(skip).limit(limit),
        Event.countDocuments(filter)
      ]);

      const mapped = events.map(withEventSlots);

      return res.json(
        buildPaginatedResponse({
          data: mapped,
          totalItems,
          currentPage: page,
          limit,
          extra: {
            events: mapped
          }
        })
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({ status: 'active', date: { $gte: today } }).sort({ date: 1 });
    return res.json(events.map(withEventSlots));
  } catch (error) {
    return next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(withEventSlots(event));
  } catch (error) {
    return next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, requirements, status, image, totalVolunteersRequired } = req.body;

    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    const requestedVolunteers = Number.isFinite(Number(totalVolunteersRequired))
      ? Number(totalVolunteersRequired)
      : Number(requirements?.volunteersNeeded || 0);

    const event = await Event.create({
      title,
      description,
      date,
      location,
      requirements,
      status,
      image,
      totalVolunteersRequired: Math.max(0, requestedVolunteers),
      currentApprovedVolunteers: 0
    });
    return res.status(201).json(withEventSlots(event));
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, requirements, status, image, totalVolunteersRequired } = req.body;

    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    const requestedVolunteers = Number.isFinite(Number(totalVolunteersRequired))
      ? Number(totalVolunteersRequired)
      : Number(requirements?.volunteersNeeded || 0);

    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (Math.max(0, requestedVolunteers) < Number(existingEvent.currentApprovedVolunteers || 0)) {
      return res.status(400).json({
        message: 'Total volunteers required cannot be less than already approved volunteers'
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        date,
        location,
        requirements,
        status,
        image,
        totalVolunteersRequired: Math.max(0, requestedVolunteers)
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(withEventSlots(event));
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
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
