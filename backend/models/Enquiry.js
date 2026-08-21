const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerPhone: { type: String, default: '' },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);