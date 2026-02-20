const express = require('express');
const { body, param } = require('express-validator');
const {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', optionalAuth, getPrograms);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['active', 'inactive'])
  ],
  validateRequest,
  createProgram
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['active', 'inactive'])
  ],
  validateRequest,
  updateProgram
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteProgram
);

module.exports = router;
