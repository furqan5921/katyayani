const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  accreditationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  establishedYear: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
collegeSchema.index({ collegeName: 'text' });
collegeSchema.index({ accreditationNumber: 1 });

module.exports = mongoose.model('College', collegeSchema);