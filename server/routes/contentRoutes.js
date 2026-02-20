const express = require('express');
const { body, param } = require('express-validator');
const { getContent, upsertContent } = require('../controllers/contentController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/:key',
  [param('key').isIn(['home', 'about', 'mission'])],
  validateRequest,
  getContent
);

router.put(
  '/:key',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('key').isIn(['home', 'about', 'mission']),
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required')
  ],
  validateRequest,
  upsertContent
);

module.exports = router;
