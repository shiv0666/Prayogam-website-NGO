const express = require('express');
const { body, param } = require('express-validator');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', optionalAuth, getEvents);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').notEmpty().isISO8601().withMessage('Valid date is required'),
    body('location').optional().isString(),
    body('status').optional().isIn(['active', 'inactive']),
    body('requirements.volunteersNeeded').optional().isInt({ min: 0 }),
    body('requirements.fundsNeeded').optional().isFloat({ min: 0 }),
    body('requirements.itemsNeeded').optional().isString()
  ],
  validateRequest,
  createEvent
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').notEmpty().isISO8601().withMessage('Valid date is required'),
    body('location').optional().isString(),
    body('status').optional().isIn(['active', 'inactive']),
    body('requirements.volunteersNeeded').optional().isInt({ min: 0 }),
    body('requirements.fundsNeeded').optional().isFloat({ min: 0 }),
    body('requirements.itemsNeeded').optional().isString()
  ],
  validateRequest,
  updateEvent
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteEvent
);

module.exports = router;
