const { asyncWrapper } = require("../Middleware/AuthValidation");
const ResourceFile = require("../Models/resourceFile");


const fetchResourceFiles = async (req, res) => {
  try {
    const resourceFiles = await ResourceFile.find();
    res.status(200).json({ success: true, resourceFiles });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ success: false, error: "Failed to fetch files" });
  }
};

const addResourceFile = asyncWrapper(async (req, res) => {
  try {
    const { fileName, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required!",
      });
    }

    if (!fileName || !description) {
      return res.status(400).json({
        success: false,
        message: "File name and description are required!",
      });
    }

    const resourceFile = await ResourceFile.create({
      fileName,
      description,
      fileData: req.file.buffer,
      fileType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: "Resource file uploaded successfully!",
      resourceFile,
    });
  } catch (error) {
    console.error("Error uploading resource file:", error);
    res.status(500).json({ success: false, error: "Failed to upload resource file" });
  }
});


const downloadResourceFile = async (req, res) => {
  try {
    const file = await ResourceFile.findById(req.params.id);

    if (!file) {
      return res.status(404).send("File not found");
    }

    // Set correct response headers
    res.set({
      "Content-Type": file.fileType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.fileName)}"`,
      "Content-Length": file.fileData.length,
    });

    // Send the file buffer directly
    return res.send(file.fileData);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).send("Server error");
  }
};


const deleteResourceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const fileItem = await ResourceFile.findById(id);

    if (!fileItem) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    await ResourceFile.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ success: false, error: "Failed to delete file" });
  }
};

const updateResourceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, description } = req.body;

    if (!fileName || !description) {
      return res.status(400).json({
        success: false,
        message: "File name and description are required!",
      });
    }

    const resourceFile = await ResourceFile.findById(id);
    if (!resourceFile) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    if (req.file) {
      resourceFile.fileData = req.file.buffer;
      resourceFile.fileType = req.file.mimetype;
    }

    resourceFile.fileName = fileName;
    resourceFile.description = description;

    await resourceFile.save();

    res.status(200).json({
      success: true,
      message: "File updated successfully!",
      resourceFile,
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ success: false, error: "Failed to update file" });
  }
};

module.exports = {
  fetchResourceFiles,
  addResourceFile,
  downloadResourceFile,
  deleteResourceFile,
  updateResourceFile,
};