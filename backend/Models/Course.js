const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({

  category: { 
    type: String, 
    enum: ['Technical','Soft Skills','Policy'], 
    required: true 
  },

  title: { 
    type: String, 
    required: true 
  },

  description: String,
  videoUrl: String,

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
});

module.exports = mongoose.model('Course', CourseSchema);
