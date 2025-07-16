const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
},
  issuedAt: { 
    type: Date, 
    default: Date.now 
},
});

module.exports = mongoose.model('Certificate', certificateSchema);
