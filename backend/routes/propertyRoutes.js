const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  getProperties, getPropertyById,
  createProperty, updateProperty,
  deleteProperty, toggleSaveProperty
} = require('../controllers/propertyController');

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, adminOnly, upload.array('images', 10), createProperty);
router.put('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);
router.put('/:id/save', protect, toggleSaveProperty);

module.exports = router;