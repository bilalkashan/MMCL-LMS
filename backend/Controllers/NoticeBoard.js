const Announcement = require("../Models/noticeBoard");

const addAnnouncements = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'All fields are required!', success: false });
        }
        const announcement = new Announcement({ title, description });
        await announcement.save();
        res.status(200).json({ message: 'Announcement added successfully!', announcement, success: true });
    } catch (error) {
        console.error("Error in addAnnouncements:", error);
        res.status(500).json({ error: 'Failed to add announcement', success: false });
    }
};

const fetchAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ announcements, success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch announcements', success: false });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'All fields are required!', success: false });
        }
                const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found', success: false });
        }

        announcement.title = title;
        announcement.description = description;

        await announcement.save();

        res.status(200).json({ message: 'Announcement updated successfully!', announcement, success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update announcement', success: false });
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findByIdAndDelete(id);
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found', success: false });
      }
  
      res.status(200).json({ message: 'Announcement deleted successfully!', success: true });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Failed to delete announcement', success: false });
    }
  };
  

module.exports = {
    addAnnouncements,
    fetchAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
};