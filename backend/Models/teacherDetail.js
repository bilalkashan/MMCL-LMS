const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherDetailSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, ref: "users", required: true },

  experience: { 
    type: Number }, 
});

const TeacherDetail = mongoose.model("teacher_details", TeacherDetailSchema);
module.exports = TeacherDetail;
