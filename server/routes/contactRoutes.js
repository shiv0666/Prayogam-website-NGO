const express = require('express');
const { body } = require('express-validator');
const { submitContact, getMessages } = require('../controllers/contactController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  validateRequest,
  submitContact
);

router.get('/', requireAuth, requireAdmin, getMessages);

module.exports = router;
