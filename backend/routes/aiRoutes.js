const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  chatWithAI, predictPrice, generateSummary
} = require('../controllers/aiController');

router.post('/chat', protect, chatWithAI);
router.post('/predict-price', protect, predictPrice);
router.get('/summary/:id', protect, generateSummary);

module.exports = router;