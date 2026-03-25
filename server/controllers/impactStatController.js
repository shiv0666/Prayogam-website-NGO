const ImpactStat = require('../models/ImpactStat');

const getNextOrder = async () => {
  const highest = await ImpactStat.findOne().sort({ order: -1, createdAt: -1 }).select('order');
  return highest ? Number(highest.order || 0) + 1 : 0;
};

const getImpactStats = async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true' && req.user;
    const filter = showAll ? {} : { status: 'active' };
    const stats = await ImpactStat.find(filter).sort({ order: 1, createdAt: 1 });
    return res.json(stats);
  } catch (error) {
    return next(error);
  }
};

const createImpactStat = async (req, res, next) => {
  try {
    const { title, value, description, icon, status, order } = req.body;
    let resolvedOrder;
    if (order === undefined || order === null || String(order).trim() === '') {
      resolvedOrder = await getNextOrder();
    } else {
      const parsed = Number(order);
      resolvedOrder = Number.isNaN(parsed) ? await getNextOrder() : parsed;
    }

    let stat;
    try {
      stat = await ImpactStat.create({
        title,
        value,
        description,
        icon: icon || '',
        status: status || 'active',
        order: resolvedOrder
      });
    } catch (error) {
      // If a legacy unique index exists on order, retry with next available order.
      if (error?.code === 11000) {
        stat = await ImpactStat.create({
          title,
          value,
          description,
          icon: icon || '',
          status: status || 'active',
          order: await getNextOrder()
        });
      } else {
        throw error;
      }
    }

    return res.status(201).json(stat);
  } catch (error) {
    return next(error);
  }
};

const updateImpactStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, value, description, icon, status, order } = req.body;

    const updateData = {
      title,
      value,
      description,
      icon,
      status
    };

    if (!(order === undefined || order === null || String(order).trim() === '')) {
      const parsed = Number(order);
      if (!Number.isNaN(parsed)) {
        updateData.order = parsed;
      }
    }

    const stat = await ImpactStat.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!stat) {
      return res.status(404).json({ message: 'Impact stat not found' });
    }
    return res.json(stat);
  } catch (error) {
    return next(error);
  }
};

const deleteImpactStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stat = await ImpactStat.findByIdAndDelete(id);
    if (!stat) {
      return res.status(404).json({ message: 'Impact stat not found' });
    }
    return res.json({ message: 'Impact stat deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getImpactStats, createImpactStat, updateImpactStat, deleteImpactStat };
