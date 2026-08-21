const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createEnquiry, getEnquiries,
  updateEnquiry, deleteEnquiry, getEnquiryStats
} = require('../controllers/enquiryController');

router.post('/', createEnquiry); // anyone can enquire
router.get('/', protect, adminOnly, getEnquiries);
router.get('/stats', protect, adminOnly, getEnquiryStats);
router.put('/:id', protect, adminOnly, updateEnquiry);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;