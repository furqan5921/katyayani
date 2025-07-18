const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },
  examName: {
    type: String,
    required: true,
    trim: true
  },
  examDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 15
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  passingMarks: {
    type: Number,
    required: true,
    min: 0
  },
  examType: {
    type: String,
    enum: ['Mid-term', 'Final', 'Quiz', 'Practical'],
    default: 'Final'
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
examSchema.index({ programId: 1 });
examSchema.index({ examDate: 1 });
examSchema.index({ examType: 1 });

module.exports = mongoose.model('Exam', examSchema);