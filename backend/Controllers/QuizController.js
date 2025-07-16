const Quiz = require('../Models/Quiz');
const Certificate = require('../Models/Certificate');

const getQuiz = async (req, res) => {
  const quiz = await Quiz.findOne({ courseId: req.params.courseId });
  res.json(quiz);
};

const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quiz = await Quiz.findById(req.params.id);
  const correct = quiz.questions.filter((q,i) => q.correctAnswerIndex === answers[i]).length;
  const score = (correct / quiz.questions.length) * 100;
  
  if (score >= quiz.passingScore) {
    const cert = new Certificate({ userId: req.user.id, courseId: quiz.courseId });
    await cert.save();
    return res.json({ passed: true, certificate: cert });
  }
  res.json({ passed: false, score });
};

module.exports = {
    getQuiz,
    submitQuiz
};
