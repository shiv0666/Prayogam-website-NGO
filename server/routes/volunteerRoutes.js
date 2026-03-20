const express = require('express');
const { body, param } = require('express-validator');
const {
  registerGeneralVolunteer,
  getGeneralVolunteers,
  approveGeneralVolunteer,
  createVolunteerRequest,
  getVolunteerRequests,
  updateVolunteerStatus,
  getVolunteerEventView,
  getAllVolunteersCombined
} = require('../controllers/volunteerController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/event/:eventId',
  [param('eventId').isMongoId()],
  validateRequest,
  getVolunteerEventView
);

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('message').optional().isString()
  ],
  validateRequest,
  registerGeneralVolunteer
);

router.post(
  '/',
  [
    body('eventId').isMongoId().withMessage('Valid eventId is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('message').optional().isString()
  ],
  validateRequest,
  createVolunteerRequest
);

router.get('/event-registrations', requireAuth, requireRole(['admin', 'ngo_admin']), getVolunteerRequests);

router.get('/', requireAuth, requireRole(['admin', 'ngo_admin']), getAllVolunteersCombined);

router.patch(
  '/:id/approve',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [param('id').isMongoId()],
  validateRequest,
  approveGeneralVolunteer
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  [
    param('id').isMongoId(),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected')
  ],
  validateRequest,
  updateVolunteerStatus
);

module.exports = router;
