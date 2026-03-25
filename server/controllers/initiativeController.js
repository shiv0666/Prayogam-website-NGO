const fs = require('fs');
const path = require('path');
const Initiative = require('../models/Initiative');

const getNextOrder = async () => {
  const highest = await Initiative.findOne().sort({ order: -1, createdAt: -1 }).select('order');
  return highest ? Number(highest.order || 0) + 1 : 0;
};

const getInitiatives = async (req, res, next) => {
  try {
    const initiatives = await Initiative.find().sort({ order: 1, date: -1, createdAt: 1 });
    return res.json(initiatives);
  } catch (error) {
    return next(error);
  }
};

const createInitiative = async (req, res, next) => {
  try {
    const { title, description, status, date, order } = req.body;

    let resolvedOrder;
    if (order === undefined || order === null || String(order).trim() === '') {
      resolvedOrder = await getNextOrder();
    } else {
      const parsed = Number(order);
      resolvedOrder = Number.isNaN(parsed) ? await getNextOrder() : parsed;
    }

    const initiative = await Initiative.create({
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      ...(status ? { status } : {}),
      date: date ? new Date(date) : null,
      order: resolvedOrder
    });

    return res.status(201).json(initiative);
  } catch (error) {
    return next(error);
  }
};

const updateInitiative = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, date, order } = req.body;

    const existing = await Initiative.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Initiative not found' });
    }

    const updateData = {
      title,
      description,
      date: date ? new Date(date) : null
    };

    if (status) {
      updateData.status = status;
    }

    if (!(order === undefined || order === null || String(order).trim() === '')) {
      const parsedOrder = Number(order);
      if (!Number.isNaN(parsedOrder)) {
        updateData.order = parsedOrder;
      }
    }

    if (req.file) {
      if (existing.image && existing.image.startsWith('/uploads/')) {
        const oldRelativePath = existing.image.replace(/^[/\\]+/, '');
        const oldPath = path.join(__dirname, '..', oldRelativePath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const initiative = await Initiative.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    return res.json(initiative);
  } catch (error) {
    return next(error);
  }
};

const deleteInitiative = async (req, res, next) => {
  try {
    const { id } = req.params;
    const initiative = await Initiative.findByIdAndDelete(id);
    if (!initiative) {
      return res.status(404).json({ message: 'Initiative not found' });
    }

    if (initiative.image && initiative.image.startsWith('/uploads/')) {
      const imageRelativePath = initiative.image.replace(/^[/\\]+/, '');
      const filePath = path.join(__dirname, '..', imageRelativePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.json({ message: 'Initiative deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getInitiatives,
  createInitiative,
  updateInitiative,
  deleteInitiative
};
