const express = require('express');
const { body, param } = require('express-validator');
const {
  createDonation,
  listDonations,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('category')
      .isIn(['Education', 'Social Welfare', 'Environment', 'Healthcare'])
      .withMessage('Valid donation category is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Donation amount must be at least 1')
  ],
  validateRequest,
  createDonation
);

router.get('/', requireAuth, requireRole(['admin', 'ngo_admin']), listDonations);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('paymentStatus').isIn(['Pending', 'Verified']).withMessage('Valid payment status is required')
  ],
  validateRequest,
  updateDonation
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteDonation
);

module.exports = router;
