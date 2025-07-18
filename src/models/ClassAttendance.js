const mongoose = require('mongoose');

const classAttendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  isPresent: {
    type: Boolean,
    required: true,
    default: false
  },
  attendanceDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique attendance per student per class
classAttendanceSchema.index({ classId: 1, studentId: 1 }, { unique: true });
classAttendanceSchema.index({ studentId: 1 });
classAttendanceSchema.index({ attendanceDate: 1 });

module.exports = mongoose.model('ClassAttendance', classAttendanceSchema);