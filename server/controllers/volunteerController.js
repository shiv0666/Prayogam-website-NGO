const Event = require('../models/Event');
const VolunteerRegistration = require('../models/VolunteerRegistration');
const Volunteer = require('../models/Volunteer');
const { withEventSlots } = require('../utils/eventSlots');
const { parsePagination, buildPaginatedResponse, getStartDateByRange } = require('../utils/pagination');

const registerGeneralVolunteer = async (req, res, next) => {
  try {
    const { name, email, phone, city, message = '' } = req.body;

    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      city,
      message,
      status: 'pending'
    });

    return res.status(201).json({
      message: 'Volunteer registration submitted successfully.',
      volunteer
    });
  } catch (error) {
    return next(error);
  }
};

const getGeneralVolunteers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status = '', search = '', dateRange = 'all', sort = 'date_desc' } = req.query;
    const filter = {};

    if (status && ['pending', 'approved'].includes(status)) {
      filter.status = status;
    }

    const rangeStart = getStartDateByRange(dateRange);
    if (rangeStart) {
      filter.createdAt = { $gte: rangeStart };
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { city: regex }
      ];
    }

    const sortMap = {
      date_desc: { createdAt: -1 },
      date_asc: { createdAt: 1 }
    };

    const sortBy = sortMap[sort] || sortMap.date_desc;

    const [volunteers, totalItems] = await Promise.all([
      Volunteer.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      Volunteer.countDocuments(filter)
    ]);

    return res.json(
      buildPaginatedResponse({
        data: volunteers,
        totalItems,
        currentPage: page,
        limit,
        extra: {
          volunteers
        }
      })
    );
  } catch (error) {
    return next(error);
  }
};

const approveGeneralVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.status = 'approved';
    await volunteer.save();

    return res.json({ message: 'Volunteer approved successfully.', volunteer });
  } catch (error) {
    return next(error);
  }
};

const createVolunteerRequest = async (req, res, next) => {
  try {
    const { eventId, name, email, phone, city, message } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'active') {
      return res.status(400).json({ message: 'This event is not accepting volunteers' });
    }

    const normalizedEvent = withEventSlots(event);
    const remaining = Math.max(0, Number(normalizedEvent.remainingVolunteers || 0));

    if (remaining <= 0) {
      return res.status(400).json({ message: 'Volunteer slots are full for this event' });
    }

    const existing = await VolunteerRegistration.findOne({
      eventId,
      email: String(email).toLowerCase().trim(),
      status: { $in: ['approved'] }
    });

    if (existing) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    event.currentApprovedVolunteers = Math.max(0, Number(normalizedEvent.currentApprovedVolunteers || 0)) + 1;
    await event.save();

    const registration = await VolunteerRegistration.create({
      eventId,
      name,
      email,
      phone,
      city,
      message,
      status: 'approved'
    });

    return res.status(201).json({
      message: 'You are successfully registered for this event.',
      registration
    });
  } catch (error) {
    return next(error);
  }
};

const getVolunteerRequests = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status = '', search = '', dateRange = 'all', sort = 'date_desc' } = req.query;
    const filter = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hide past-event registrations from admin list without deleting data.
    const pastEvents = await Event.find({ date: { $lt: today } }).select('_id');
    if (pastEvents.length > 0) {
      filter.eventId = { $nin: pastEvents.map((event) => event._id) };
    }

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const rangeStart = getStartDateByRange(dateRange);
    if (rangeStart) {
      filter.createdAt = { $gte: rangeStart };
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');

      const matchingEvents = await Event.find({ title: regex }).select('_id');
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { city: regex },
        { eventId: { $in: matchingEvents.map((event) => event._id) } }
      ];
    }

    const sortMap = {
      date_desc: { createdAt: -1 },
      date_asc: { createdAt: 1 }
    };

    const sortBy = sortMap[sort] || sortMap.date_desc;

    const [requests, totalItems] = await Promise.all([
      VolunteerRegistration.find(filter)
        .populate('eventId', 'title date location totalVolunteersRequired currentApprovedVolunteers status')
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      VolunteerRegistration.countDocuments(filter)
    ]);

    return res.json(
      buildPaginatedResponse({
        data: requests,
        totalItems,
        currentPage: page,
        limit,
        extra: {
          requests
        }
      })
    );
  } catch (error) {
    return next(error);
  }
};

const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const request = await VolunteerRegistration.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Volunteer request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be updated' });
    }

    if (status === 'approved') {
      const event = await Event.findById(request.eventId);
      if (!event) {
        return res.status(404).json({ message: 'Related event not found' });
      }

      const normalizedEvent = withEventSlots(event);
      const approved = Math.max(0, Number(normalizedEvent.currentApprovedVolunteers || 0));
      const remaining = Math.max(0, Number(normalizedEvent.remainingVolunteers || 0));

      if (remaining <= 0) {
        return res.status(400).json({ message: 'No volunteer slots remaining for this event' });
      }

      event.currentApprovedVolunteers = approved + 1;
      await event.save();
    }

    request.status = status;
    await request.save();

    const populated = await VolunteerRegistration.findById(request._id)
      .populate('eventId', 'title date location totalVolunteersRequired currentApprovedVolunteers status');

    return res.json(populated);
  } catch (error) {
    return next(error);
  }
};

const getVolunteerEventView = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(withEventSlots(event));
  } catch (error) {
    return next(error);
  }
};

const getAllVolunteersCombined = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search = '', volunteerType = '', dateRange = 'all', sort = 'date_desc' } = req.query;

    const rangeStart = getStartDateByRange(dateRange);

    const sortMap = {
      date_desc: { createdAt: -1 },
      date_asc: { createdAt: 1 }
    };
    const sortBy = sortMap[sort] || sortMap.date_desc;

    let combined = [];

    // Get general volunteers (if type is 'general' or empty)
    if (!volunteerType || volunteerType === 'general') {
      const generalFilter = {};
      if (rangeStart) {
        generalFilter.createdAt = { $gte: rangeStart };
      }
      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        generalFilter.$or = [
          { name: regex },
          { email: regex },
          { phone: regex },
          { city: regex }
        ];
      }

      const generalVolunteers = await Volunteer.find(generalFilter)
        .sort(sortBy)
        .lean();

      combined.push(
        ...generalVolunteers.map((vol) => ({
          ...vol,
          type: 'general',
          eventName: 'General Volunteer'
        }))
      );
    }

    // Get event-based volunteers (if type is 'event' or empty)
    if (!volunteerType || volunteerType === 'event') {
      const eventFilter = {};
      if (rangeStart) {
        eventFilter.createdAt = { $gte: rangeStart };
      }
      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        const matchingEvents = await Event.find({ title: regex }).select('_id');
        eventFilter.$or = [
          { name: regex },
          { email: regex },
          { phone: regex },
          { city: regex },
          { eventId: { $in: matchingEvents.map((event) => event._id) } }
        ];
      }

      const eventVolunteers = await VolunteerRegistration.find(eventFilter)
        .populate('eventId', 'title')
        .lean();

      combined.push(
        ...eventVolunteers.map((vol) => ({
          ...vol,
          type: 'event',
          eventName: vol.eventId?.title || 'Unknown Event'
        }))
      );
    }

    // Sort combined results
    combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'date_desc' ? dateB - dateA : dateA - dateB;
    });

    // Apply pagination on combined results
    const paginatedResults = combined.slice(skip, skip + limit);
    const totalItems = combined.length;

    return res.json(
      buildPaginatedResponse({
        data: paginatedResults,
        totalItems,
        currentPage: page,
        limit
      })
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerGeneralVolunteer,
  getGeneralVolunteers,
  approveGeneralVolunteer,
  createVolunteerRequest,
  getVolunteerRequests,
  updateVolunteerStatus,
  getVolunteerEventView,
  getAllVolunteersCombined
};
