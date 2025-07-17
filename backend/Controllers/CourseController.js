const Course = require("../Models/Course");
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
      "name email"
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Employee Submit quiz answers
// const submitQuiz = async (req, res) => {
//   try {
//     const { answers } = req.body; // Array of selected indexes
//     const courseId = req.params.courseId;
//     const employeeId = req.user._id;

//     const course = await Course.findById(courseId);
//     if (!course)
//       return res
//         .status(404)
//         .json({ success: false, message: "Course not found" });

//     // Find enrolled employee
//     const enrolled = course.enrolledEmployees.find(
//       (e) => e.employeeId.toString() === employeeId.toString()
//     );
//     if (!enrolled)
//       return res.status(400).json({ success: false, message: "Not enrolled" });

//     if (!course.quiz.length)
//       return res
//         .status(400)
//         .json({ success: false, message: "No quiz for this course" });
//     if (!answers || answers.length !== course.quiz.length)
//       return res
//         .status(400)
//         .json({ success: false, message: "Incomplete answers" });

//     let score = 0;
//     course.quiz.forEach((q, idx) => {
//       if (q.correctAnswerIndex === answers[idx]) score++;
//     });

//     const passingScore = Math.ceil(course.quiz.length * 0.7); // 70% passing

//     if (score >= passingScore) {
//       enrolled.status = "completed";
//       enrolled.quizScore = score;
//       enrolled.completedAt = new Date();
//       await course.save();

//       // Generate e-certificate URL or file link - dummy for now
//       const certificateUrl = `https://yourlms.com/certificates/${course._id}/${employeeId}`;

//       return res
//         .status(200)
//         .json({ success: true, message: "Quiz passed", score, certificateUrl });
//     } else {
//       return res
//         .status(200)
//         .json({ success: false, message: "Quiz failed", score });
//     }
//   } catch (err) {
//     console.error("Submit Quiz Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

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

// Employee enrolled courses
// const getMyCourses = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     const employeeId = mongoose.Types.ObjectId(req.user._id);

//     // Find courses where enrolledEmployees contains this user
//     const courses = await Course.find({
//       "enrolledEmployees.employeeId": employeeId
//     });

//     // Map to include user-specific enrollment info
//     const myCourses = courses.map(course => {
//       const enrolledData = course.enrolledEmployees.find(
//         e => e.employeeId.toString() === employeeId.toString()
//       );

//       return {
//         _id: course._id,
//         title: course.title,
//         description: course.description,
//         category: course.category,
//         videoUrl: course.videoUrl,
//         status: enrolledData?.status,
//         quizScore: enrolledData?.quizScore,
//         completedAt: enrolledData?.completedAt,
//         quiz: course.quiz
//       };
//     });

//     res.status(200).json({ success: true, courses: myCourses });
//   } catch (error) {
//     console.error("Error fetching enrolled courses:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getMyCourses = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const employeeId = mongoose.Types.ObjectId(req.user._id);

    // Find courses where enrolledEmployees contains this user
    const courses = await Course.find({
      "enrolledEmployees.employeeId": employeeId
    });

    // Map to include user-specific enrollment info
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

const getTotalCourses = async (req, res) => {
  try {
    const users = await UserModel.find({
      is_active: true,
      is_verified: true,
      role: "user",
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getTotalEnrolledUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      is_active: true,
      role: "user",
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getTotalVerifiedUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      is_verified: true,
      role: "user",
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};


module.exports = {
  addCourse,
  getCourses,
  enrollCourse,
  submitQuiz,
  getMyCourses,
};
