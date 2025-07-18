const mongoose = require('mongoose');

const studentEnrollmentSchema = new mongoose.Schema({
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
  enrollmentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Enrolled', 'In Progress', 'Completed', 'Dropped', 'Failed'],
    default: 'Enrolled'
  },
  completionDate: {
    type: Date,
    default: null
  },
  currentPhase: {
    type: String,
    enum: ['Classroom', 'Examination', 'Internship', 'Completed'],
    default: 'Classroom'
  },
  classroomStartDate: {
    type: Date,
    required: true
  },
  classroomEndDate: {
    type: Date,
    required: true
  },
  internshipStartDate: {
    type: Date,
    default: null
  },
  internshipEndDate: {
    type: Date,
    default: null
  },
  overallGrade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass', 'Fail'],
    default: null
  },
  finalScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  attendancePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  feesStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid', 'Waived'],
    default: 'Pending'
  },
  feesPaid: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure unique enrollment per student per program
studentEnrollmentSchema.index({ studentId: 1, programId: 1 }, { unique: true });
studentEnrollmentSchema.index({ studentId: 1 });
studentEnrollmentSchema.index({ programId: 1 });
studentEnrollmentSchema.index({ status: 1 });
studentEnrollmentSchema.index({ currentPhase: 1 });

module.exports = mongoose.model('StudentEnrollment', studentEnrollmentSchema);