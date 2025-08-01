const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
  getContactStats,
} = require('../controllers/contactController');

// Public route - Submit contact form
router.post('/', submitContact);

// Protected routes - Admin only
router.get('/', authenticateToken, getContacts);
router.get('/stats', authenticateToken, getContactStats);
router.put('/:id', authenticateToken, updateContactStatus);
router.delete('/:id', authenticateToken, deleteContact);

module.exports = router;
