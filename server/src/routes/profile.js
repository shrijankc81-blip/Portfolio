const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  resetProfile
} = require('../controllers/profileController');

// Public route - Get profile information
router.get('/', getProfile);

// Protected routes - Admin only
router.put('/', authenticateToken, updateProfile);
router.post('/upload-image', authenticateToken, upload.single('image'), uploadProfileImage);
router.post('/reset', authenticateToken, resetProfile);

module.exports = router;
