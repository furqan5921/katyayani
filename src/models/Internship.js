const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Terminated'],
    default: 'Ongoing'
  },
  evaluation: {
    type: String,
    trim: true
  },
  feedback: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique internship per student
internshipSchema.index({ studentId: 1 }, { unique: true });
internshipSchema.index({ hospitalId: 1 });
internshipSchema.index({ supervisorId: 1 });

module.exports = mongoose.model('Internship', internshipSchema);