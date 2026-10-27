const Announcement = require("../models/Announcement");

// Which audiences each role is allowed to see
const audienceFor = (role) => {
  if (role === "Employee") return ["All", "Employees"];
  if (role === "Manager") return ["All", "Managers"];
  return ["All", "Employees", "Managers"]; // HR sees everything
};

// GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  const items = await Announcement.find({ targetAudience: { $in: audienceFor(req.user.role) } })
    .populate("createdBy", "name role")
    .sort({ createdAt: -1 });
  res.json(items);
};

// POST /api/announcements  (HR, Manager)
exports.createAnnouncement = async (req, res) => {
  const { title, message, targetAudience } = req.body;
  const item = await Announcement.create({ title, message, targetAudience, createdBy: req.user._id });
  await item.populate("createdBy", "name role");
  res.status(201).json(item);
};

// PUT /api/announcements/:id  (HR, Manager)
exports.updateAnnouncement = async (req, res) => {
  const { title, message, targetAudience } = req.body;
  const item = await Announcement.findByIdAndUpdate(
    req.params.id,
    { title, message, targetAudience },
    { returnDocument: "after", runValidators: true }
  ).populate("createdBy", "name role");
  if (!item) return res.status(404).json({ message: "Announcement not found" });
  res.json(item);
};

// DELETE /api/announcements/:id  (HR, Manager)
exports.deleteAnnouncement = async (req, res) => {
  const item = await Announcement.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Announcement not found" });
  res.json({ message: "Announcement deleted" });
};
