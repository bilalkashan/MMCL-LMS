const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { 
    type: String, required: true },

  email: { 
    type: String, required: true, unique: true },

  password: { 
    type: String, required: true },

  is_active: { 
    type: Boolean, 
    required: true 
  },

  is_verified: { 
    type: Boolean, 
    required: true 
  },

  otp: { 
    type: String, required: true },

  role: {
    type: String,
    enum: ['admin','user'],
    required: true,
    default:'user'
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
