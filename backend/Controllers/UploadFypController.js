const FypSubmission = require('../Models/FypSubmission');
const Adviser = require('../Models/adviser');
const StudentDetail = require('../Models/studentDetail');

const getAllFypSubmissions = async (req, res) => {
  try {
    // Fetch all FYP submissions that have been approved
    const submissions = await FypSubmission.find({ isApproved: true }).populate("studentId", "name email");

    const submissionsWithDetails = await Promise.all(
      submissions.map(async (submission) => {
        // Adviser
        const adviser = await Adviser.findById(submission.adviserId);

        const adviserInfo = adviser
          ? {
              name: adviser.name,
              email: adviser.email,
              specialization: adviser.specialization,
            }
          : null;

        // Student Detail Info
        let studentDetail = null;
        if (submission.studentId?._id) {
          studentDetail = await StudentDetail.findOne({ userId: submission.studentId._id }).lean();
        }

        return {
          ...submission.toObject(),
          adviser: adviserInfo,
          studentInfo: studentDetail
            ? {
                registrationNumber: studentDetail.registrationNumber,
                department: studentDetail.department,
                year: studentDetail.year,
                batch: studentDetail.batch
              }
            : null
        };
      })
    );

    res.status(200).json({ success: true, data: submissionsWithDetails });
  } catch (error) {
    console.error("Error fetching all FYPs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch FYPs" });
  }
};


const getStudentFyp = async (req, res) => {
  try {
    const { studentIdOrReg } = req.params;

    // Step 1: Find student's registration number using the provided user _id
    const studentDetail = await StudentDetail.findOne({ userId: studentIdOrReg });

    if (!studentDetail) {
      return res.status(404).json({ success: false, message: "Student detail not found." });
    }

    const regNumber = studentDetail.registrationNumber;

    // Step 2: Fetch all FYPs where the student is owner or in group members
    const submissions = await FypSubmission.find({
      $or: [
        { studentId: studentIdOrReg },
        { groupMembers: { $in: [regNumber] } }
      ]
    }).populate("studentId", "name email");

    // Step 3: Attach adviser info for each submission
    const submissionsWithAdviser = await Promise.all(
      submissions.map(async (submission) => {
        const adviser = await Adviser.findOne({
          slots: {
            $elemMatch: {
              $or: [
                { "reservedBy.reg1": { $in: submission.groupMembers } },
                { "reservedBy.reg2": { $in: submission.groupMembers } }
              ]
            }
          }
        });

        const adviserInfo = adviser
          ? {
              name: adviser.name,
              email: adviser.email,
              specialization: adviser.specialization
            }
          : null;

        return {
          ...submission.toObject(),
          adviser: adviserInfo
        };
      })
    );

    // Step 4: Return to frontend
    res.status(200).json({
      success: true,
      data: submissionsWithAdviser
    });

  } catch (error) {
    console.error("Error fetching student's FYPs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student's FYPs" });
  }
};

const getFilteredFyps = async (req, res) => {
  try {
    const { department, year } = req.query;
   console.log("Filtering FYPs for department:", department, "and year:", year);
   
    if (!department || !year) {
      return res.status(400).json({ success: false, message: "Department and year are required" });
    }

    const students = await StudentDetail.find({ department, year });
    const studentUserIds = students.map((s) => s.userId);

    const submissions = await FypSubmission.find({
      studentId: { $in: studentUserIds },
    }).populate("studentId", "name email");

    const enhanced = await Promise.all(
      submissions.map(async (submission) => {
        const adviser = await Adviser.findOne({
          slots: {
            $elemMatch: {
              $or: [
                { "reservedBy.reg1": { $in: submission.groupMembers } },
                { "reservedBy.reg2": { $in: submission.groupMembers } }
              ]
            }
          }
        });

        return {
          ...submission.toObject(),
          adviser: adviser
            ? {
                name: adviser.name,
                email: adviser.email,
                specialization: adviser.specialization,
              }
            : null,
        };
      })
    );

    res.status(200).json({ success: true, data: enhanced });
  } catch (error) {
    console.error("Error filtering FYPs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const submitFyp = async (req, res) => {
  try {
    const { title, groupMembers, description, projectLink, srs, sds, video, adviserId } = req.body;
    const studentId = req.user._id; // Assuming the user is authenticated and we get their ID from JWT or session

    // Create new FYP submission
    const newFyp = new FypSubmission({
      title,
      groupMembers,
      description,
      projectLink,
      srs,
      sds,
      video,
      studentId,
      adviserId, // Store the selected adviser
      isApproved: false, // Initially, the FYP is not approved
    });

    await newFyp.save();

    res.status(201).json({ success: true, message: "FYP submitted successfully, awaiting approval" });
  } catch (error) {
    console.error("Error submitting FYP:", error);
    res.status(500).json({ success: false, message: "Failed to submit FYP" });
  }
};

const approveRejectFyp = async (req, res) => {
  const { fypId, status } = req.body; // status can be 'approved' or 'rejected'

  try {
    const fyp = await FypSubmission.findById(fypId);
    if (!fyp) {
      return res.status(404).json({ success: false, message: "FYP not found" });
    }

    if (status === "approved") {
      fyp.isApproved = true;
    } else if (status === "rejected") {
      fyp.isApproved = false;
    } else {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    await fyp.save();
    res.status(200).json({ success: true, message: `FYP ${status} successfully` });
  } catch (error) {
    console.error("Error approving FYP:", error);
    res.status(500).json({ success: false, message: "Failed to update FYP status" });
  }
};

module.exports = {
  approveRejectFyp,
  submitFyp,
  getAllFypSubmissions,
  getStudentFyp,
  getFilteredFyps
};