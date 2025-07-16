// validationMiddleware.js
const FypSubmission = require('../Models/FypSubmission');
const StudentDetail = require('../Models/studentDetail');

async function validateFypSubmission(req, res, next) {
  try {
    const { title, groupMembers, description, projectLink, studentId } = req.body;
    console.log('Validating FYP submission:', { title, groupMembers, description, projectLink, studentId });
    if (!title || !groupMembers || !description || !studentId) {
      return res.status(400).json({ success: false, message: 'Required fields missing.' });
    }

    let parsedGroupMembers = [];
    try {
      parsedGroupMembers = JSON.parse(groupMembers);
      if (!Array.isArray(parsedGroupMembers)) throw new Error();
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid groupMembers format.' });
    }

    // Check duplicates
    const existingFyp = await FypSubmission.findOne({
      $or: [
        { studentId },
        { groupMembers: { $in: parsedGroupMembers } }
      ]
    });
    if (existingFyp) {
      return res.status(409).json({ success: false, message: 'You or group member already submitted FYP.' });
    }

    // Check valid students
    const existingStudents = await StudentDetail.find({
      registrationNumber: { $in: parsedGroupMembers }
    });
    if (existingStudents.length !== parsedGroupMembers.length) {
      return res.status(400).json({ success: false, message: 'One or more group members not found.' });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ success: false, message: 'Server error during validation.' });
  }
}

module.exports = validateFypSubmission;