const OpenIdea = require("../Models/openIdea");

const addProjectIdea = async (req, res) => {
  try {
    const { topic, description, caseStudy, technology } = req.body;

    if (!topic || !description || !caseStudy || !technology) {
      return res
        .status(400)
        .json({ message: "All fields are required !!", success: false });
    }

    const existingTopic = await OpenIdea.findOne({
      topic: { $in: topic },
      description: { $in: description },
    });

    if (existingTopic) {
      return res
        .status(400)
        .json({
          message: "Topic or description is already added!",
          success: false,
        });
    }

    const openIdea = new OpenIdea({
      topic,
      description,
      caseStudy,
      technology,
    });
    await openIdea.save();

    res
      .status(200)
      .json({
        message: "Project Idea added successfully!",
        openIdea,
        success: true,
      });
  } catch (error) {
    console.error("Error in adding project idea!:", error);
    res
      .status(500)
      .json({ error: "Failed to add project idea", success: false });
  }
};

const fetchProjectIdea = async (req, res) => {
  try {
    const openIdeas = await OpenIdea.find().sort({ createdAt: -1 });
    res.status(200).json({ openIdeas, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch project ideas", success: false });
  }
};

const updateProjectIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { topic, description, caseStudy, technology } = req.body;

    if (!topic || !description || !caseStudy || !technology) {
      return res
        .status(400)
        .json({ message: "All fields are required !!", success: false });
    }

    const openIdea = await OpenIdea.findById(id);
    if (!result) {
      return res
        .status(404)
        .json({ error: "Result not found", success: false });
    }

    openIdea.topic = topic;
    openIdea.description = description;
    openIdea.caseStudy = caseStudy;
    openIdea.technology = technology;

    await openIdea.save();

    res
      .status(200)
      .json({
        message: "Project idea updated successfully!",
        openIdea,
        success: true,
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update project idea", success: false });
  }
};

const deleteProjectIdea = async (req, res) => {
  try {
    const { id } = req.query;
    console.log("Deleting result with ID:", id);

    const openIdea = await OpenIdea.findByIdAndDelete(id);

    if (!openIdea) {
      return res
        .status(404)
        .json({ error: "Project Idea not found", success: false });
    }

    res
      .status(200)
      .json({ message: "Project idea deleted successfully!", success: true });
  } catch (error) {
    console.error("Error deleting project idea:", error);
    res
      .status(500)
      .json({ error: "Failed to delete project idea", success: false });
  }
};

module.exports = {
  addProjectIdea,
  fetchProjectIdea,
  updateProjectIdea,
  deleteProjectIdea,
};