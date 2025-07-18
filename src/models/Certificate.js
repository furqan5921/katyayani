const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `CERT-${uuidv4().substring(0, 8).toUpperCase()}`
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  },
  certificateType: {
    type: String,
    enum: ['Completion', 'Excellence', 'Participation'],
    default: 'Completion'
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass'],
    required: true
  },
  finalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  validationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  digitalSignature: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    default: null // null means no expiry
  },
  revokedAt: {
    type: Date,
    default: null
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
  },
  revokeReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Virtual for certificate status
certificateSchema.virtual('status').get(function() {
  if (this.revokedAt) return 'Revoked';
  if (this.expiryDate && this.expiryDate < new Date()) return 'Expired';
  if (!this.isValid) return 'Invalid';
  return 'Valid';
});

// Index for efficient queries
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ studentId: 1 });
certificateSchema.index({ programId: 1 });
certificateSchema.index({ issueDate: 1 });
certificateSchema.index({ isValid: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);