const Course = require("../Models/Course");
// const User = require("../Models/User");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const streamifier = require("streamifier");
const mongoose = require('mongoose');

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Admin Upload Course
const addCourse = async (req, res) => {
  try {
    const { title, description, category, quiz } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    // Upload video to Cloudinary
    const result = await streamUpload(req.file.buffer);

    const course = new Course({
      title,
      description,
      category,
      videoUrl: result.secure_url,
      quiz: JSON.parse(quiz), // frontend sends quiz as JSON string
    });

    await course.save();

    res.status(201).json({ success: true, message: "Course added successfully", course });
  } catch (err) {
    console.error("Course Upload Error:", err);
    res.status(500).json({ success: false, error: "Failed to upload course" });
  }
};

// Admin get all courses with enrolled employee counts & details
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "enrolledEmployees.employeeId",
      "name email department designation"
    );
    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error("Get Courses Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Employee Enroll in Course
const enrollCourse = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const courseId = req.params.courseId;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledEmployees.some(enrolled => 
      enrolled.employeeId.toString() === employeeId.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Push enrollment
    course.enrolledEmployees.push({
      employeeId: employeeId,
      status: 'enrolled'
    });

    await course.save();

    return res.status(200).json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ success: false, message: 'Already enrolled in this course' });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const courseId = req.params.courseId;
    const { answers } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrolledIndex = course.enrolledEmployees.findIndex(
      e => e.employeeId.toString() === employeeId.toString()
    );

    if (enrolledIndex === -1) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
    }

    // Calculate score
    let score = 0;
    for (let i = 0; i < course.quiz.length; i++) {
      if (answers[i] === course.quiz[i].correctAnswerIndex) {
        score++;
      }
    }

    const passingScore = Math.ceil(course.quiz.length * 0.7); // example 70% passing criteria
    const success = score >= passingScore;

    // Update enrollment status if passed
    course.enrolledEmployees[enrolledIndex].quizScore = score;
    if (success) {
      course.enrolledEmployees[enrolledIndex].status = 'completed';
      course.enrolledEmployees[enrolledIndex].completedAt = new Date();
    }

    await course.save();

    // Optionally, generate a certificate URL here or return null
    const certificateUrl = success ? `/certificates/${courseId}/${employeeId}.pdf` : null;

    res.status(200).json({
      success: true,
      score,
      success: success,
      certificateUrl
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyCourses = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const employeeId = new mongoose.Types.ObjectId(req.user._id); 

    const courses = await Course.find({
      "enrolledEmployees.employeeId": employeeId
    });

    const myCourses = courses.map(course => {
      const enrolledData = course.enrolledEmployees.find(
        e => e.employeeId.toString() === employeeId.toString()
      );

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        videoUrl: course.videoUrl,
        status: enrolledData?.status,
        quizScore: enrolledData?.quizScore,
        completedAt: enrolledData?.completedAt,
        quiz: course.quiz
      };
    });

    res.status(200).json({ success: true, courses: myCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const getTotalEnrolledCourses = async (req, res) => {
//   try {
//     const Course = await CourseModel.find({
//       title: true,
//     });
//     res.status(200).json({ success: true, Course });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };

// const getTotalCompletedCourses = async (req, res) => {
//   try {
//     const users = await UserModel.find({
//       is_active: true,
//       role: "user",
//     });
//     res.status(200).json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };

// const getTotalInProgressCourses = async (req, res) => {
//   try {
//     const users = await UserModel.find({
//       is_verified: true,
//       role: "user",
//     });
//     res.status(200).json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };


// Get total number of courses with at least one enrollment
const getTotalEnrolledCourses = async (req, res) => {
  try {
    const enrolledCourses = await Course.find({ enrolledEmployees: { $exists: true, $not: { $size: 0 } } });
    res.status(200).json({ success: true, total: enrolledCourses.length });
  } catch (error) {
    console.error("Error in getTotalEnrolledCourses:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get total number of users who completed any course
// const getTotalCompletedCourses = async (req, res) => {
//   try {
//     const users = await User.find({
//       role: "user",
//       "enrolledCourses.status": "completed"
//     });
//     res.status(200).json({ success: true, total: users.length });
//   } catch (error) {
//     console.error("Error in getTotalCompletedCourses:", error);
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };

// // Get total number of users who are still in progress
// const getTotalInProgressCourses = async (req, res) => {
//   try {
//     const users = await User.find({
//       role: "user",
//       "enrolledCourses.status": "in-progress"
//     });
//     res.status(200).json({ success: true, total: users.length });
//   } catch (error) {
//     console.error("Error in getTotalInProgressCourses:", error);
//     res.status(500).json({ message: "Server error", success: false });
//   }
// };


module.exports = {
  addCourse,
  getCourses,
  enrollCourse,
  submitQuiz,
  getMyCourses,
  getTotalEnrolledCourses,
  // getTotalCompletedCourses,
  // getTotalInProgressCourses
};
