const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  quizPassed: { 
    type: Boolean, 
    default: false 
  },
  certificateUrl: String,
  enrolledAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
