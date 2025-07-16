const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  registrationNumbers: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 2, 'Must provide exactly two registration numbers'],
  },
  projectTitle: {
    type: String,
    required: true,
  },
  advisorName: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  fypType: {
    type: String,
    required: true,
    enum: ['FYP I', 'FYP II'], 
  },
});

const Result = mongoose.model("result", ResultSchema);
module.exports = Result;