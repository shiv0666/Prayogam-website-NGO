const express = require('express');
const { body, param } = require('express-validator');
const {
  getInitiatives,
  createInitiative,
  updateInitiative,
  deleteInitiative
} = require('../controllers/initiativeController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getInitiatives);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    body('date').optional({ checkFalsy: true }).isISO8601().withMessage('Date must be valid'),
    body('order').optional({ checkFalsy: true }).isNumeric().withMessage('Order must be numeric')
  ],
  validateRequest,
  createInitiative
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  upload.single('image'),
  [
    param('id').isMongoId(),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    body('date').optional({ checkFalsy: true }).isISO8601().withMessage('Date must be valid'),
    body('order').optional({ checkFalsy: true }).isNumeric().withMessage('Order must be numeric')
  ],
  validateRequest,
  updateInitiative
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteInitiative
);

module.exports = router;
