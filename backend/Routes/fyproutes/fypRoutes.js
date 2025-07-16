const express = require("express");
const multer = require("multer");
const { cloudinary } = require("../../utils/cloudinary");
const FypSubmission = require("../../Models/FypSubmission");
const StudentDetail = require("../../Models/studentDetail");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/submit-fyp",
  upload.fields([
    { name: "srs", maxCount: 1 },
    { name: "sds", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        groupMembers,
        description,
        projectLink,
        studentId,
        adviserId,
      } = req.body;

      if (
        !title ||
        !groupMembers ||
        !description ||
        !projectLink ||
        !studentId
      ) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      const parsedGroupMembers = JSON.parse(groupMembers);

      const existingFyp = await FypSubmission.findOne({
        $or: [{ studentId }, { groupMembers: { $in: parsedGroupMembers } }],
      });

      if (existingFyp) {
        return res.status(409).json({
          success: false,
          message: "You or a group member has already submitted a FYP.",
        });
      }

      const existingStudents = await StudentDetail.find({
        registrationNumber: { $in: parsedGroupMembers },
      });

      if (existingStudents.length !== parsedGroupMembers.length) {
        return res.status(400).json({
          success: false,
          message: "One or more group members are not valid students.",
        });
      }

      const uploadToCloudinary = async (
        fileBuffer,
        folder,
        resource_type,
        originalname
      ) => {
        const fileName = `${Date.now()}-${originalname.replace(
          /\.[^/.]+$/,
          ""
        )}`;

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto", // Let Cloudinary detect file type (PDF, video, etc.)
              folder,
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
              overwrite: true,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url); // Use secure_url as-is for viewing inline
            }
          );
          stream.end(fileBuffer);
        });
      };

      const srsUrl = await uploadToCloudinary(
        req.files["srs"][0].buffer,
        "fyp_uploads",
        "auto",
        req.files["srs"][0].originalname
      );
      const sdsUrl = await uploadToCloudinary(
        req.files["sds"][0].buffer,
        "fyp_uploads",
        "auto",
        req.files["sds"][0].originalname
      );
      const videoUrl = await uploadToCloudinary(
        req.files["video"][0].buffer,
        "fyp_uploads",
        "video",
        req.files["video"][0].originalname
      );

      const submission = new FypSubmission({
        title,
        groupMembers: parsedGroupMembers,
        description,
        projectLink,
        studentId,
        adviserId, 
        srs: srsUrl,
        sds: sdsUrl,
        video: videoUrl,
        isApproved: false, 
      });

      await submission.save();

      return res.status(201).json({
        success: true,
        message: "FYP submitted successfully and uploaded to Cloudinary.",
      });
    } catch (error) {
      console.error("FYP submission error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Submission failed." });
    }
  }
);

module.exports = router;
