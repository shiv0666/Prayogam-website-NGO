const express = require('express');
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password is required')
  ],
  validateRequest,
  login
);

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password is required')
  ],
  validateRequest,
  register
);

module.exports = router;
