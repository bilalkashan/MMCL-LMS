// const multer = require("multer");

// const FILE_TYPES = [
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
//   "image/jpeg",
//   "image/png",
// ];

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (FILE_TYPES.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF, DOCX, JPEG, and PNG files are allowed."));
//   }
// };

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, 
//   },
//   fileFilter,
// });

// module.exports = upload;


const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

module.exports = upload;
