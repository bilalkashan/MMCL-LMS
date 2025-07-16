const Course = require("../Models/Course");
const cloudinary = require("../utils/cloudinary"); // You'll create this helper
const fs = require("fs");
const streamifier = require("streamifier");


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

// Admin: Upload Course
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


// Admin: Get all courses with enrolled employee counts & details
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

// Employee: Enroll in course
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const employeeId = req.user._id; // from verifyToken middleware

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Check if already enrolled
    const enrolled = course.enrolledEmployees.find(
      (e) => e.employeeId.toString() === employeeId.toString()
    );
    if (enrolled)
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled" });

    course.enrolledEmployees.push({ employeeId, status: "enrolled" });
    await course.save();

    res.status(200).json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enroll Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Employee: Submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected indexes
    const courseId = req.params.courseId;
    const employeeId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Find enrolled employee
    const enrolled = course.enrolledEmployees.find(
      (e) => e.employeeId.toString() === employeeId.toString()
    );
    if (!enrolled)
      return res.status(400).json({ success: false, message: "Not enrolled" });

    if (!course.quiz.length)
      return res
        .status(400)
        .json({ success: false, message: "No quiz for this course" });
    if (!answers || answers.length !== course.quiz.length)
      return res
        .status(400)
        .json({ success: false, message: "Incomplete answers" });

    let score = 0;
    course.quiz.forEach((q, idx) => {
      if (q.correctAnswerIndex === answers[idx]) score++;
    });

    const passingScore = Math.ceil(course.quiz.length * 0.7); // 70% passing

    if (score >= passingScore) {
      enrolled.status = "completed";
      enrolled.quizScore = score;
      enrolled.completedAt = new Date();
      await course.save();

      // Generate e-certificate URL or file link - dummy for now
      const certificateUrl = `https://yourlms.com/certificates/${course._id}/${employeeId}`;

      return res
        .status(200)
        .json({ success: true, message: "Quiz passed", score, certificateUrl });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Quiz failed", score });
    }
  } catch (err) {
    console.error("Submit Quiz Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Employee: Get enrolled courses with progress
const getMyCourses = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const courses = await Course.find({
      "enrolledEmployees.employeeId": employeeId,
    }).select("title description category videoUrl enrolledEmployees");

    const result = courses.map((course) => {
      const enrolled = course.enrolledEmployees.find(
        (e) => e.employeeId.toString() === employeeId.toString()
      );
      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        videoUrl: course.videoUrl,
        status: enrolled.status,
        quizScore: enrolled.quizScore,
        completedAt: enrolled.completedAt,
        quiz: course.quiz,
      };
    });

    res.status(200).json({ success: true, courses: result });
  } catch (err) {
    console.error("Get My Courses Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addCourse,
  getCourses,
  enrollCourse,
  submitQuiz,
  getMyCourses,
};
