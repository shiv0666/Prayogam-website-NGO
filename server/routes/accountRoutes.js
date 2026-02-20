const express = require('express');
const { body, param } = require('express-validator');
const {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} = require('../controllers/accountController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireRole(['admin']), listAccounts);

router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password is required'),
    body('role').isIn(['admin', 'ngo_admin', 'user']).withMessage('Valid role is required')
  ],
  validateRequest,
  createAccount
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  [
    param('id').isMongoId(),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['admin', 'ngo_admin', 'user']).withMessage('Valid role is required')
  ],
  validateRequest,
  updateAccount
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  [param('id').isMongoId()],
  validateRequest,
  deleteAccount
);

module.exports = router;
