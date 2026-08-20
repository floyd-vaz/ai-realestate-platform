const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'plot', 'commercial'],
    required: true
  },
  status: {
    type: String,
    enum: ['sale', 'rent'],
    required: true
  },
  features: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true }, // in sq ft
    parking: { type: Boolean, default: false },
    furnished: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    }
  },
  images: [{
    url: { type: String },
    public_id: { type: String }
  }],
  amenities: [String], // e.g. ['gym', 'pool', 'security']
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  aiSummary: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);