const mongoose = require("mongoose");

const FypSubmissionSchema = new mongoose.Schema({
  title: String,
  groupMembers: [String],
  description: String,
  projectLink: String,
  srs: String, 
  sds: String, 
  video: String, 
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users" 
  },
  advisorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Adviser" 
  }, 
  isVerified: { 
    type: Boolean, 
    default: false 
  }, 
}, { timestamps: true });

module.exports = mongoose.model("FypSubmission", FypSubmissionSchema);
