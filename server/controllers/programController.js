const Program = require('../models/Program');
const { isAdminRole } = require('../middleware/auth');

const getPrograms = async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    if (showAll) {
      if (!req.user || !isAdminRole(req.user.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const programs = await Program.find().sort({ createdAt: -1 });
      return res.json(programs);
    }

    const programs = await Program.find({ status: 'active' }).sort({ createdAt: -1 });
    return res.json(programs);
  } catch (error) {
    return next(error);
  }
};

const createProgram = async (req, res, next) => {
  try {
    const { title, description, status, image, mapLocation, lat, lng } = req.body;
    const program = await Program.create({ title, description, status, image, mapLocation, lat: lat || null, lng: lng || null });
    return res.status(201).json(program);
  } catch (error) {
    return next(error);
  }
};

const updateProgram = async (req, res, next) => {
  try {
    const { title, description, status, image, mapLocation, lat, lng } = req.body;
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { title, description, status, image, mapLocation, lat: lat || null, lng: lng || null },
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    return res.json(program);
  } catch (error) {
    return next(error);
  }
};

const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    return res.json({ message: 'Program deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram
};
