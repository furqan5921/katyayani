const mongoose = require('mongoose');

const certificateValidationSchema = new mongoose.Schema({
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    required: true
  },
  validatorName: {
    type: String,
    required: true,
    trim: true
  },
  validatorEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  validatorOrganization: {
    type: String,
    required: true,
    trim: true
  },
  validationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  validationPurpose: {
    type: String,
    required: true,
    enum: ['Employment Verification', 'Academic Verification', 'License Application', 'Background Check', 'Other'],
    trim: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  validationResult: {
    type: String,
    enum: ['Valid', 'Invalid', 'Expired', 'Revoked'],
    required: true
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for efficient queries
certificateValidationSchema.index({ certificateId: 1 });
certificateValidationSchema.index({ validationDate: 1 });
certificateValidationSchema.index({ validatorEmail: 1 });
certificateValidationSchema.index({ validationPurpose: 1 });

module.exports = mongoose.model('CertificateValidation', certificateValidationSchema);