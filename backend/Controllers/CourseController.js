const Course = require('../Models/Course');
const cloudinary = require('../utils/cloudinary');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { category, title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Video is required' });
    const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });
    const course = await Course.create({ category, title, description, videoUrl: upload.secure_url });
    return res.status(201).json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const update = {};
    const { category, title, description } = req.body;
    if (category) update.category = category;
    if (title) update.title = title;
    if (description) update.description = description;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });
      update.videoUrl = upload.secure_url;
    }
    const course = await Course.findByIdAndUpdate(id, update, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses
}
