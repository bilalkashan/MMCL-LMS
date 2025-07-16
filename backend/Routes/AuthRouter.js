const express = require('express');
const router = express.Router();
const { signupValidation, loginValidation } = require('../Middleware/AuthValidation');
const { signup, login, verify, forgetPassword, resetPassword, getTotalUsers, acceptUser, deleteUserRequest, getTotalActiveUsers, getTotalVerifiedUsers } = require('../Controllers/AuthController');
const { addAdviser, updateSlots, getAllAdvisers, deleteAdviser, sendAdviserRequest, getAdviserRequestsForTeacher, getStudentRequests, updateRequestStatus, updateRequestFeedback } = require('../Controllers/AdviserController');
const { addAnnouncements, fetchAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../Controllers/NoticeBoard');
const { addResults, fetchresults, deleteresult, getGroupInfo, addGroup } = require('../Controllers/ResultController');
const { addProjectIdea, fetchProjectIdea, deleteProjectIdea } = require('../Controllers/OpenIdeaController');
const { fetchResourceFiles, deleteResourceFile, updateResourceFile, addResourceFile, downloadResourceFile } = require('../Controllers/ResourceFileController');
const { approveRejectFyp, getAllFypSubmissions, getStudentFyp, getFilteredFyps } = require('../Controllers/UploadFypController');
const fypRoutes = require('./fyproutes/fypRoutes.js');
const verifyToken = require('../Middleware/verifyToken.js');
const { getEmployeeProgress } = require('../Controllers/progressController');
const upload = require('../Middleware/multer'); // multer configured with memoryStorage for direct Cloudinary upload
const {
  addCourse,
  getCourses,
  enrollCourse,
  submitQuiz,
  getMyCourses
} = require('../Controllers/CourseController');

// 🔓 Public Routes
router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/verify", verify);
router.post("/forget", forgetPassword);
router.post("/resetPassword", resetPassword);

// 🔐 Auth-protected Routes
router.post("/getTotalUsers", verifyToken, getTotalUsers);
router.post("/getTotalActiveUsers", verifyToken, getTotalActiveUsers);
router.post("/getTotalVerifiedUsers", verifyToken, getTotalVerifiedUsers);
router.post("/acceptUser", verifyToken, acceptUser);
router.post("/deleteUserRequest", verifyToken, deleteUserRequest);

// Adviser Routes
router.post("/addAdviser", verifyToken, addAdviser); 
router.put("/update-slot/:adviserId/:slotIndex", verifyToken, updateSlots); 
router.get("/getAllAdvisers", verifyToken, getAllAdvisers); 
router.delete("/deleteAdviser", verifyToken, deleteAdviser); 
router.post("/sendAdviserRequest", verifyToken, sendAdviserRequest);
router.get('/getAdviserRequestsForTeacher/:adviseremail', verifyToken, getAdviserRequestsForTeacher);
router.get("/getStudentRequests/:email", verifyToken, getStudentRequests);
router.put("/updateRequestStatus/:id", verifyToken, updateRequestStatus);
router.put("/updateRequestFeedback/:id", verifyToken, updateRequestFeedback);

// Notice Board Routes
router.post('/addAnouncements', verifyToken, addAnnouncements);
router.get('/fetchAnnouncements', fetchAnnouncements);
router.put('/updateAnnouncement/:id', verifyToken, updateAnnouncement);
router.delete('/deleteAnnouncement/:id', verifyToken, deleteAnnouncement);

// Result Routes
router.post('/addResults', verifyToken, addResults);
router.get('/fetchresults', verifyToken, fetchresults);
router.delete('/deleteresult', verifyToken, deleteresult); 
router.get('/get-group-info/:groupName', verifyToken, getGroupInfo);
router.post('/add-group', verifyToken, addGroup);

// Open Project Idea Routes
router.post('/addProjectIdea', verifyToken, addProjectIdea);
router.get('/fetchProjectIdea', verifyToken, fetchProjectIdea);
router.delete('/deleteProjectIdea', verifyToken, deleteProjectIdea); 

// Resource Files
router.get("/fetchResourceFiles", verifyToken, fetchResourceFiles);
router.post("/addResourceFile", verifyToken, upload.single("file"), addResourceFile);
router.get("/downloadResourceFile/:id", verifyToken, downloadResourceFile);
router.put("/updateResourceFile/:id", verifyToken, upload.single("file"), updateResourceFile);
router.delete("/deleteResourceFile/:id", verifyToken, deleteResourceFile);

// FYP Routes
router.use('/fyp', verifyToken, fypRoutes);
router.get('/fyp/get-student-fyp/:studentIdOrReg', verifyToken, getStudentFyp);
router.get('/fyp/get-all', verifyToken, getAllFypSubmissions);
router.get('/fyp/filter', verifyToken, getFilteredFyps);
router.put("/approve-reject", verifyToken, approveRejectFyp);

// Employee Progress
router.get('/employee/:userId', getEmployeeProgress);


router.post('/addCourse', verifyToken, upload.single('video'), addCourse);
router.get('/courses', verifyToken, getCourses);

// Employee routes
router.post('/enroll/:courseId', verifyToken, enrollCourse);
router.post('/submitQuiz/:courseId', verifyToken, submitQuiz);
router.get('/myCourses', verifyToken, getMyCourses);

module.exports = router;
