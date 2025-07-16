const Result = require("../Models/result");
const GroupMapping = require("../Models/GroupMapping");
const Adviser = require("../Models/adviser");  // Adjust path as needed

const addResults = async (req, res) => {
  try {
    const {
      groupName,
      registrationNumbers,
      projectTitle,
      advisorName,
      remarks,
      status,
      fypType,
    } = req.body;

    if (
      !groupName ||
      !registrationNumbers ||
      registrationNumbers.length !== 2 ||
      !projectTitle ||
      !advisorName ||
      !remarks ||
      !status ||
      !fypType
    ) {
      return res.status(400).json({
        message:
          "All fields are required including exactly 2 registration numbers and FYP Type!",
        success: false,
      });
    }
    
    const existing = await Result.findOne({
      registrationNumbers: { $in: registrationNumbers },
    });

    if (existing) {
      return res.status(400).json({
        message: "One or both registration numbers already have results added!",
        success: false,
      });
    }

    const result = new Result({
      groupName,
      registrationNumbers,
      projectTitle,
      advisorName,
      remarks,
      status,
      fypType,
    });

    await result.save();

    res.status(200).json({
      message: "Result added successfully!",
      result,
      success: true,
    });
  } catch (error) {
    console.error("Error in addResults:", error);
    res.status(500).json({ error: "Failed to add result", success: false });
  }
};

const fetchresults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.status(200).json({ results, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results", success: false });
  }
};

const updateresult = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      groupName,
      registrationNumbers,
      projectTitle,
      advisorName,
      remarks,
      status,
      fypType,
    } = req.body;

    if (
      !groupName ||
      !registrationNumbers ||
      registrationNumbers.length !== 2 ||
      !projectTitle ||
      !advisorName ||
      !remarks ||
      !status ||
      !fypType
    ) {
      return res.status(400).json({
        message:
          "All fields are required including exactly 2 registration numbers and FYP Type!",
        success: false,
      });
    }

    const result = await Result.findById(id);
    if (!result) {
      return res
        .status(404)
        .json({ error: "Result not found", success: false });
    }

    result.groupName = groupName;
    result.registrationNumbers = registrationNumbers;
    result.projectTitle = projectTitle;
    result.advisorName = advisorName;
    result.remarks = remarks;
    result.status = status;
    result.fypType = fypType;

    await result.save();

    res.status(200).json({
      message: "Result updated successfully!",
      result,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateresult:", error);
    res.status(500).json({ error: "Failed to update result", success: false });
  }
};

const deleteresult = async (req, res) => {
  try {
    const { id } = req.query;
    console.log("Deleting result with ID:", id);

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Result not found", success: false });
    }

    res.status(200).json({
      message: "Result deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Failed to delete result", success: false });
  }
};
const addGroup = async (req, res) => {
  const { groupName, registrationNumbers, projectTitle } = req.body;

  if (!groupName || !registrationNumbers || registrationNumbers.length !== 2 || !projectTitle) {
    return res.status(400).json({ success: false, message: "Provide groupName, exactly two registration numbers, and projectTitle." });
  }

  try {
    const exists = await GroupMapping.findOne({ groupName });
    if (exists) {
      return res.status(409).json({ success: false, message: "Group name already exists." });
    }

    const newGroup = new GroupMapping({ groupName, registrationNumbers, projectTitle });
    await newGroup.save();

    return res.status(201).json({ success: true, message: "Group created successfully", group: newGroup });
  } catch (err) {
    console.error("Add group error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getGroupInfo = async (req, res) => {
  try {
    const groupName = req.params.groupName;
    const group = await GroupMapping.findOne({ groupName });

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const [reg1, reg2] = group.registrationNumbers;

    const adviser = await Adviser.findOne({
      slots: {
        $elemMatch: {
          status: "reserved",
          $or: [
            { "reservedBy.reg1": reg1 },
            { "reservedBy.reg2": reg1 },
            { "reservedBy.reg1": reg2 },
            { "reservedBy.reg2": reg2 },
          ],
        },
      },
    });
   console.log(group.projectTitle)
    res.json({
      success: true,
      registrationNumbers: group.registrationNumbers,
      projectTitle: group.projectTitle,
      adviserName: adviser ? adviser.name : null,
    });
  } catch (error) {
    console.error("Error in getGroupInfo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





module.exports = {
  addResults,
  fetchresults,
  updateresult,
  deleteresult,
  getGroupInfo,
  addGroup
};