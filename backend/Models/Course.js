const mongoose = require('mongoose');

const enrolledSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users' 
  },
  status: { 
    type: String, 
    enum: ['enrolled', 'completed'], 
    default: 'enrolled' 
  },
  quizScore: Number,
  completedAt: Date,
});

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  category: { 
    type: String, 
    enum: ['Technical', 'Soft Skills', 'Policy'], 
    required: true 
  },
  videoUrl: { 
    type: String, 
    required: true 
  },
  quiz: [{
    question: String,
    options: [String],
    correctAnswerIndex: Number
  }],
  enrolledEmployees: [enrolledSchema],
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Course', courseSchema);
