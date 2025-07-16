// const mongoose = require('mongoose');

// const CourseProgressSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'users', 
//     required: true 
// },
//   courseId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Course', 
//     required: true 
// },
//   status: { 
//     type: String, 
//     enum: ['completed', 'in_progress', 'incomplete'], 
//     required: true 
// }
// });

// module.exports = mongoose.model('CourseProgress', CourseProgressSchema);


const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['completed', 'in_progress', 'incomplete'], 
    required: true 
  }
}, { timestamps: true });


module.exports = mongoose.model('CourseProgress', CourseProgressSchema);
