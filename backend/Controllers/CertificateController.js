const Certificate = require('../Models/Certificate');

const getCertificate = async (req, res) => {
  const cert = await Certificate.findOne({ userId: req.user.id, courseId: req.params.courseId });
  res.json(cert);
};

module.exports = {
    getCertificate
};
