const mongoose = require("mongoose");

const resourceFileSchema = new mongoose.Schema({
  
  fileName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  fileData: { 
    type: Buffer, 
    required: true 
  },
  fileType: { 
    type: String, 
    required: true 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
  });

module.exports = mongoose.model("ResourceFile", resourceFileSchema);

