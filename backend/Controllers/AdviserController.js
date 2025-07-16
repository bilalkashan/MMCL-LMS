const Adviser = require("../Models/adviser");
const Teacher = require("../Models/teacherDetail");
const UserModel = require("../Models/user");
const StudentDetail = require('../Models/studentDetail');
const AdviserRequest = require("../Models/AdviserRequest");
const FypSubmission = require('../Models/FypSubmission');
const jwt = require("jsonwebtoken");

const addAdviser = async (req, res) => {
    const { name, email, specialization } = req.body;

    try {
        if (!name || !email || !specialization) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format", success: false });
        }

        const existingAdviser = await Adviser.findOne({ email });
        if (existingAdviser) {
            return res.status(400).json({ message: "Adviser with this email already exists", success: false });
        }

        const teacher = await UserModel.findOne({ email });
        if (!teacher || teacher.role !== "teacher") {
            return res.status(404).json({ message: "No teacher found with this email", success: false });
        }

        const defaultSlots = [
            { slotName: "Slot-I", status: "unavailable" },
            { slotName: "Slot-II", status: "unavailable" },
            { slotName: "Slot-III", status: "unavailable" },
            { slotName: "Slot-IV", status: "unavailable" }
        ];

        const adviser = new Adviser({
            name,
            email,
            specialization,
            teacherId: teacher._id,
            slots: defaultSlots
        });

        await adviser.save();

        res.status(201).json({ message: "Adviser added successfully", adviser, success: true });

    } catch (error) {
        console.error("Error adding adviser:", error);
        res.status(500).json({ message: "Error adding adviser", error });
    }
};


const updateSlots = async (req, res) => {
    try {
        const { adviserId, slotIndex } = req.params;
        const { status, reg1, reg2 } = req.body;

        // If reserving a slot, validate registration numbers
        if (status === "reserved") {
            if (!reg1 || !reg2) {
                return res.status(400).json({ success: false, message: "Both registration numbers are required." });
            }

            if (reg1 === reg2) {
                return res.status(400).json({ success: false, message: "Registration numbers must be different." });
            }

            // Check if both students exist
            const student1 = await StudentDetail.findOne({ registrationNumber: reg1 });
            const student2 = await StudentDetail.findOne({ registrationNumber: reg2 });

            if (!student1 || !student2) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Registration number${!student1 ? ` ${reg1}` : ''}${!student1 && !student2 ? ' and' : ''}${!student2 ? ` ${reg2}` : ''} not found in student records.` 
                });
            }

            // Check if already reserved with any adviser
            const advisers = await Adviser.find();
            for (let adviser of advisers) {
                for (let slot of adviser.slots) {
                    if (
                        slot.status === "reserved" &&
                        (slot.reservedBy?.reg1 === reg1 || slot.reservedBy?.reg2 === reg1 ||
                         slot.reservedBy?.reg1 === reg2 || slot.reservedBy?.reg2 === reg2)
                    ) {
                        const alreadyUsedReg = 
                            slot.reservedBy?.reg1 === reg1 || slot.reservedBy?.reg2 === reg1 ? reg1 : reg2;

                        return res.status(400).json({
                            success: false,
                            message: `Registration number ${alreadyUsedReg} is already reserved with another adviser.`
                        });
                    }
                }
            }
        }

        // Find adviser
        const adviser = await Adviser.findById(adviserId);
        if (!adviser) {
            return res.status(404).json({ success: false, message: "Adviser not found." });
        }

        // Update slot
        adviser.slots[slotIndex].status = status;
        adviser.slots[slotIndex].reservedBy = status === "reserved" ? { reg1, reg2 } : { reg1: null, reg2: null };

        await adviser.save();
        res.json({ success: true, message: "Slot updated successfully." });

    } catch (error) {
        console.error("Slot update error:", error);
        res.status(500).json({ success: false, message: "Internal server error during slot update." });
    }
};

const getAllAdvisers = async (req, res) => {
    try {
      const role = req.headers.role;
      const email = req.headers.email; // get email from header now
  
      let advisers;
      if (role === "teacher") {
        advisers = await Adviser.find({ email: email }); // Match by email
      } else {
        advisers = await Adviser.find(); // Admin sees all
      }
  
      res.status(200).json(advisers);
    } catch (error) {
      console.error("Error fetching advisers:", error);
      res.status(500).json({ message: "Error fetching advisers", success: false });
    }
  };
  
const deleteAdviser = async (req, res) => {
    const { id } = req.body;

    try {
        const adviser = await Adviser.findById(id);
        if (!adviser) {
            return res.status(404).json({ message: "Adviser not found" });
        }

        await Adviser.deleteOne({ _id: id });
        res.status(200).json({ message: "Adviser deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete adviser", error });
    }
};

const sendAdviserRequest = async (req, res) => {
  try {
    const { adviserId, adviserName, slotName, studentEmail, message } = req.body;

    if (!adviserId || !adviserName || !slotName || !studentEmail || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newRequest = new AdviserRequest({
      adviserId,
      adviserName,
      slotName,
      studentEmail,
      message,
      status: "pending",
    });

    await newRequest.save();

    return res.status(201).json({ success: true, message: "Request sent successfully" });
  } catch (err) {
    console.error("Request Error:", err);
    return res.status(500).json({ success: false, message: "Failed to send request" });
  }
};

const getAdviserRequestsForTeacher = async (req, res) => {
    const { adviseremail } = req.params; 
    try {
      const adviser = await Adviser.findOne({ email: adviseremail });
      if (!adviser) {
        return res.status(404).json({ success: false, message: "Adviser not found with this email" });
      }
  
      const requests = await AdviserRequest.find({ adviserId: adviser._id }).sort({ createdAt: -1 });
  
      return res.status(200).json({ success: true, requests });
    } catch (err) {
      console.error("Error fetching adviser requests:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };

const getStudentRequests = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Student email is required" });
  }

  try {
    const requests = await AdviserRequest.find({ studentEmail: email }).sort({ createdAt: -1 });
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching adviser requests:", error);
    res.status(500).json({ error: "Server error while fetching adviser requests" });
  }
};
  
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status value
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  try {
    const updatedRequest = await AdviserRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Adviser request not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Request successfully ${status}`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating adviser request status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateRequestFeedback = async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;

  if (!feedback || feedback.trim() === "") {
    return res.status(400).json({ success: false, message: "Feedback cannot be empty" });
  }

  try {
    const updatedRequest = await AdviserRequest.findByIdAndUpdate(
      id,
      { feedback },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Adviser request not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const submitFyp = async (req, res) => {
    try {
        const { title, groupMembers, description, projectLink, srs, sds, video, adviserId } = req.body;
        const studentId = req.user._id;

        // Find adviser
        const adviser = await Adviser.findById(adviserId);
        if (!adviser) {
            return res.status(404).json({ success: false, message: "Adviser not found" });
        }

        const newFyp = new FypSubmission({
            title,
            groupMembers,
            description,
            projectLink,
            srs,
            sds,
            video,
            studentId,
            adviserId,
            isVerified: false, // Pending approval
        });

        await newFyp.save();
        res.status(200).json({
            success: true,
            message: "FYP submitted. Awaiting advisor's approval."
        });
    } catch (err) {
        console.error("Error submitting FYP:", err);
        res.status(500).json({ success: false, message: "Error submitting FYP." });
    }
};

// Approve or Reject FYP (by advisor)
const approveFyp = async (req, res) => {
  const { fypId, status } = req.body;  // status can be 'approved' or 'rejected'

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
  submitFyp,
  approveFyp, 
  addAdviser, 
  updateSlots,
  getAllAdvisers, deleteAdviser ,sendAdviserRequest,getAdviserRequestsForTeacher,getStudentRequests
, updateRequestStatus, updateRequestFeedback
};