const mongoose = require("mongoose");

const AdviserRequestSchema = new mongoose.Schema({
  adviserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher_details",
    required: true,
  },
  adviserName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  slotName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  feedback: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("AdviserRequest", AdviserRequestSchema);