const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    required: true
  },
  isPassed: {
    type: Boolean,
    required: true
  },
  examDate: {
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

// Compound index to ensure unique result per student per exam
examResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });
examResultSchema.index({ studentId: 1 });
examResultSchema.index({ isPassed: 1 });

module.exports = mongoose.model('ExamResult', examResultSchema);