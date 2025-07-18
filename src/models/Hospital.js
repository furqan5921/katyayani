const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  facilityName: {
    type: String,
    required: true,
    trim: true
  },
  cityName: {
    type: String,
    required: true,
    default: 'Pune'
  },
  zoneName: {
    type: String,
    required: true,
    trim: true
  },
  wardName: {
    type: String,
    required: true,
    trim: true
  },
  zoneNo: {
    type: Number,
    required: true
  },
  wardNo: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Hospital', 'Nursing Home', 'Lab'],
    trim: true
  },
  class: {
    type: String,
    required: true,
    enum: ['Public', 'Private'],
    trim: true
  },
  pharmacyAvailable: {
    type: Boolean,
    default: false
  },
  emergencyBeds: {
    type: Number,
    default: 0,
    min: 0
  },
  totalBeds: {
    type: Number,
    default: 0,
    min: 0
  },
  doctorCount: {
    type: Number,
    default: 0,
    min: 0
  },
  nurseCount: {
    type: Number,
    default: 0,
    min: 0
  },
  midwivesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  avgMonthlyPatients: {
    type: Number,
    default: 0,
    min: 0
  },
  ambulanceService: {
    type: Boolean,
    default: false
  },
  ambulanceCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
hospitalSchema.index({ zoneName: 1, wardName: 1 });
hospitalSchema.index({ type: 1, class: 1 });
hospitalSchema.index({ facilityName: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);