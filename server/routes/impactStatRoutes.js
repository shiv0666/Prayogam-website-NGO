const express = require('express');
const { body, param } = require('express-validator');
const {
  getImpactStats,
  createImpactStat,
  updateImpactStat,
  deleteImpactStat
} = require('../controllers/impactStatController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', optionalAuth, getImpactStats);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('value').notEmpty().withMessage('Value is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['active', 'inactive']),
    body('order').optional().isNumeric()
  ],
  validateRequest,
  createImpactStat
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('title').notEmpty().withMessage('Title is required'),
    body('value').notEmpty().withMessage('Value is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['active', 'inactive']),
    body('order').optional().isNumeric()
  ],
  validateRequest,
  updateImpactStat
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteImpactStat
);

module.exports = router;
