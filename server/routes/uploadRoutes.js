const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/upload — admin uploads an image, receives back the URL
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'ngo_admin']),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const url = `/uploads/${req.file.filename}`;
    return res.json({ url });
  }
);

module.exports = router;
