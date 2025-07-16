const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupMappingSchema = new Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
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
});

const GroupMapping = mongoose.model("GroupMapping", GroupMappingSchema);
module.exports = GroupMapping;