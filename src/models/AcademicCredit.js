const mongoose = require('mongoose');

const academicCreditSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },
  creditsAwarded: {
    type: Number,
    required: true,
    min: 0
  },
  creditDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  academicYear: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{4}$/, 'Please enter academic year in YYYY-YYYY format']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique credit award
academicCreditSchema.index({ studentId: 1, programId: 1, collegeId: 1 }, { unique: true });

module.exports = mongoose.model('AcademicCredit', academicCreditSchema);