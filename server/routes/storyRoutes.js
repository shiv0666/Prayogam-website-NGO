const express = require('express');
const { body, param } = require('express-validator');
const { getStories, createStory, updateStory, deleteStory } = require('../controllers/storyController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getStories);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  validateRequest,
  createStory
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  upload.single('image'),
  [
    param('id').isMongoId(),
    body('name').notEmpty().withMessage('Name is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  validateRequest,
  updateStory
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteStory
);

module.exports = router;
