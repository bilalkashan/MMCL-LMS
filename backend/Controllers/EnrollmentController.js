const Enrollment = require('../Models/Enrollment');
const cloudinary = require('../utils/cloudinary');

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const exists = await Enrollment.findOne({ userId, courseId });
    if (exists) return res.status(400).json({ error: 'Already enrolled' });
    const enrollment = await Enrollment.create({ userId, courseId });
    return res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { enrollmentId, passed } = req.body;
    const e = await Enrollment.findById(enrollmentId);
    if (!e) return res.status(404).json({ error: 'Enrollment not found' });
    e.quizPassed = passed;
    if (passed) {
      const cert = await cloudinary.uploader.upload(`${enrollmentId}`, { resource_type: 'raw', folder: 'certificates' });
      e.certificateUrl = cert.secure_url;
    }
    await e.save();
    return res.json(e);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await Enrollment.find({ userId }).populate('courseId');
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  enrollCourse,
  submitQuiz,
  getMyCourses
}
