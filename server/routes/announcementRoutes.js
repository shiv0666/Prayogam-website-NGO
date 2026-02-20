const express = require('express');
const { body, param } = require('express-validator');
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', optionalAuth, getAnnouncements);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('date').notEmpty().isISO8601().withMessage('Valid date is required')
  ],
  validateRequest,
  createAnnouncement
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('date').notEmpty().isISO8601().withMessage('Valid date is required')
  ],
  validateRequest,
  updateAnnouncement
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteAnnouncement
);

module.exports = router;
