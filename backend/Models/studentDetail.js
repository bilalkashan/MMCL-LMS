const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentDetailSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, ref: "users", required: true },

  registrationNumber: { 
    type: String, required: true, unique: true },

  department: { 
    type: String, required: true },

  year: { 
    type: String, required: true },
    
  batch: { 
    type: String, required: true },
});

const StudentDetail = mongoose.model("student_details", StudentDetailSchema);
module.exports = StudentDetail;
