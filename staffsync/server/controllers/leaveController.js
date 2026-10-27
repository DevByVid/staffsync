const Leave = require("../models/Leave");

// POST /api/leaves  (Employee)
exports.applyLeave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  if (!startDate || !endDate || !reason) {
    return res.status(400).json({ message: "Start date, end date and reason are required" });
  }
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: "End date cannot be before start date" });
  }
  const leave = await Leave.create({ user: req.user._id, startDate, endDate, reason });
  res.status(201).json(leave);
};

// GET /api/leaves/my  (Employee)
exports.getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
};

// GET /api/leaves  (HR, Manager)
exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate("user", "name email department")
    .populate("approvedBy", "name role")
    .sort({ createdAt: -1 });
  res.json(leaves);
};

// PUT /api/leaves/:id/status  (HR, Manager)  body: { status: "Approved" | "Rejected" }
exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });

  leave.status = status;
  leave.approverRole = req.user.role;
  leave.approvedBy = req.user._id;
  await leave.save();
  await leave.populate("user", "name email department");
  await leave.populate("approvedBy", "name role");
  res.json(leave);
};

// DELETE /api/leaves/:id  (owner, only while Pending)
exports.cancelLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  if (!leave.user.equals(req.user._id)) return res.status(403).json({ message: "Not your leave request" });
  if (leave.status !== "Pending") return res.status(400).json({ message: "Only pending requests can be cancelled" });
  await leave.deleteOne();
  res.json({ message: "Leave request cancelled" });
};
