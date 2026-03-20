const express = require('express');
const { body, param } = require('express-validator');
const { getLedger, createEntry, updateEntry, deleteEntry } = require('../controllers/fundLedgerController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public — anyone can view fund usage transparency
router.get('/', getLedger);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    body('year').isInt({ min: 2000, max: 2100 }).withMessage('A valid year is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('amountRaised').isFloat({ min: 0 }).withMessage('Amount raised must be ≥ 0'),
    body('amountSpent').isFloat({ min: 0 }).withMessage('Amount spent must be ≥ 0')
  ],
  validateRequest,
  createEntry
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('year').isInt({ min: 2000, max: 2100 }).withMessage('A valid year is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('amountRaised').isFloat({ min: 0 }).withMessage('Amount raised must be ≥ 0'),
    body('amountSpent').isFloat({ min: 0 }).withMessage('Amount spent must be ≥ 0')
  ],
  validateRequest,
  updateEntry
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteEntry
);

module.exports = router;
