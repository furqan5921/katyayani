const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  classDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  classType: {
    type: String,
    enum: ['Lecture', 'Lab', 'Seminar', 'Workshop'],
    default: 'Lecture'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

// Index for efficient queries
classSchema.index({ programId: 1 });
classSchema.index({ instructorId: 1 });
classSchema.index({ classDate: 1 });
classSchema.index({ status: 1 });

module.exports = mongoose.model('Class', classSchema);