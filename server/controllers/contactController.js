const ContactMessage = require('../models/ContactMessage');
const { parsePagination, buildPaginatedResponse, getStartDateByRange } = require('../utils/pagination');

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
    const { page, limit, skip } = parsePagination(req.query);
    const { search = '', dateRange = 'all', sort = 'date_desc' } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { message: regex }];
    }

    const rangeStart = getStartDateByRange(dateRange);
    if (rangeStart) {
      filter.createdAt = { $gte: rangeStart };
    }

    const sortMap = {
      date_desc: { createdAt: -1 },
      date_asc: { createdAt: 1 }
    };

    const sortBy = sortMap[sort] || sortMap.date_desc;

    const [messages, totalItems] = await Promise.all([
      ContactMessage.find(filter).sort(sortBy).skip(skip).limit(limit),
      ContactMessage.countDocuments(filter)
    ]);

    return res.json(
      buildPaginatedResponse({
        data: messages,
        totalItems,
        currentPage: page,
        limit,
        extra: {
          messages
        }
      })
    );
  } catch (error) {
    return next(error);
  }
};

module.exports = { submitContact, getMessages };
