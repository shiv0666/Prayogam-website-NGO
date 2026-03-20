const Donation = require('../models/Donation');
const { parsePagination, buildPaginatedResponse, getStartDateByRange } = require('../utils/pagination');

const DONATION_CATEGORIES = ['Education', 'Social Welfare', 'Environment', 'Healthcare'];

const buildSummary = (donations) => {
  const initialByCategory = DONATION_CATEGORIES.reduce((accumulator, category) => {
    accumulator[category] = 0;
    return accumulator;
  }, {});

  return donations.reduce(
    (summary, donation) => {
      summary.totalAmount += donation.amount;
      summary.totalDonors += 1;
      summary.byCategory[donation.category] += donation.amount;
      return summary;
    },
    {
      totalAmount: 0,
      totalDonors: 0,
      byCategory: initialByCategory
    }
  );
};

const createDonation = async (req, res, next) => {
  try {
    const { name, email, phone, category, amount } = req.body;
    const donation = await Donation.create({
      name,
      email: email.toLowerCase(),
      phone,
      category,
      amount,
      paymentStatus: 'Pending'
    });

    return res.status(201).json({
      message: 'Donation recorded successfully.',
      donation
    });
  } catch (error) {
    return next(error);
  }
};

const listDonations = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search = '', category = '', minAmount = '', maxAmount = '', dateRange = 'all', sort = 'date_desc' } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (category && DONATION_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const rangeStart = getStartDateByRange(dateRange);
    if (rangeStart) {
      filter.createdAt = { $gte: rangeStart };
    }

    const sortMap = {
      date_desc: { createdAt: -1 },
      date_asc: { createdAt: 1 },
      amount_asc: { amount: 1, createdAt: -1 },
      amount_desc: { amount: -1, createdAt: -1 }
    };

    const sortBy = sortMap[sort] || sortMap.date_desc;

    const [donations, totalItems, summarySeed] = await Promise.all([
      Donation.find(filter).sort(sortBy).skip(skip).limit(limit),
      Donation.countDocuments(filter),
      Donation.find(filter).select('amount category')
    ]);

    const summary = buildSummary(summarySeed);

    return res.json(
      buildPaginatedResponse({
        data: donations,
        totalItems,
        currentPage: page,
        limit,
        extra: {
          donations,
          summary
        }
      })
    );
  } catch (error) {
    return next(error);
  }
};

const updateDonation = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    return res.json({
      message: 'Donation updated successfully.',
      donation
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    return res.json({ message: 'Donation deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDonation,
  listDonations,
  updateDonation,
  deleteDonation,
  DONATION_CATEGORIES
};
