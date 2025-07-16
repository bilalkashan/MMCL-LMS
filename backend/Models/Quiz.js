const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswerIndex: Number,
    }],
    passingScore: { 
        type: Number, 
        default: 100 
    },
});

module.exports = mongoose.model('Quiz', quizSchema);
