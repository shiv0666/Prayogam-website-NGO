const express = require('express');
const { body } = require('express-validator');
const { getSettings, upsertSettings } = require('../controllers/settingsController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSettings);

router.put(
  '/',
  requireAuth,
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('founder').notEmpty().withMessage('Founder is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('contact').notEmpty().withMessage('Contact is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('domain').notEmpty().withMessage('Domain is required')
  ],
  validateRequest,
  upsertSettings
);

module.exports = router;
