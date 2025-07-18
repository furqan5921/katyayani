const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  programCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    default: 12 // months
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  maxStudents: {
    type: Number,
    required: true,
    min: 1,
    default: 30
  },
  currentEnrollment: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  curriculum: [{
    subject: {
      type: String,
      required: true
    },
    hours: {
      type: Number,
      required: true,
      min: 1
    },
    description: String
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  fees: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  classroomPhase: {
    duration: {
      type: Number,
      required: true,
      default: 6 // months
    },
    location: {
      type: String,
      required: true
    }
  },
  internshipPhase: {
    duration: {
      type: Number,
      required: true,
      default: 6 // months
    },
    minPassingMarks: {
      type: Number,
      required: true,
      default: 60
    }
  }
}, {
  timestamps: true
});

// Virtual for available slots
trainingProgramSchema.virtual('availableSlots').get(function() {
  return this.maxStudents - this.currentEnrollment;
});

// Virtual for program status
trainingProgramSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.startDate) return 'Upcoming';
  if (now > this.endDate) return 'Completed';
  return 'Ongoing';
});

// Index for efficient queries
trainingProgramSchema.index({ programCode: 1 });
trainingProgramSchema.index({ startDate: 1, endDate: 1 });
trainingProgramSchema.index({ isActive: 1 });
trainingProgramSchema.index({ programName: 'text', description: 'text' });

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);