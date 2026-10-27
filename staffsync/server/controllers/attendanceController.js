const Attendance = require("../models/Attendance");

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const nowTime = () => new Date().toLocaleTimeString("en-US");

// POST /api/attendance/checkin
exports.checkIn = async (req, res) => {
  const today = startOfToday();
  const existing = await Attendance.findOne({ user: req.user._id, date: today });
  if (existing) return res.status(400).json({ message: "Already checked in today" });

  const record = await Attendance.create({
    user: req.user._id,
    date: today,
    checkInTime: req.body.time || nowTime(),
    status: "Present",
  });
  res.status(201).json(record);
};

// POST /api/attendance/checkout
exports.checkOut = async (req, res) => {
  const record = await Attendance.findOne({ user: req.user._id, date: startOfToday() });
  if (!record) return res.status(400).json({ message: "You have not checked in today" });
  if (record.checkOutTime) return res.status(400).json({ message: "Already checked out today" });

  record.checkOutTime = req.body.time || nowTime();
  await record.save();
  res.json(record);
};

// GET /api/attendance/my
exports.getMyAttendance = async (req, res) => {
  const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
  res.json(records);
};

// GET /api/attendance/today
exports.getToday = async (req, res) => {
  const record = await Attendance.findOne({ user: req.user._id, date: startOfToday() });
  res.json(record);
};

// GET /api/attendance  (HR)  optional ?from=YYYY-MM-DD&to=YYYY-MM-DD
exports.getAllAttendance = async (req, res) => {
  const filter = {};
  if (req.query.from || req.query.to) {
    filter.date = {};
    if (req.query.from) filter.date.$gte = new Date(req.query.from);
    if (req.query.to) filter.date.$lte = new Date(req.query.to);
  }
  const records = await Attendance.find(filter)
    .populate("user", "name email department")
    .sort({ date: -1 });
  res.json(records);
};

// GET /api/attendance/report  (HR) - summary per employee
exports.getReport = async (req, res) => {
  const report = await Attendance.aggregate([
    { $group: { _id: { user: "$user", status: "$status" }, count: { $sum: 1 } } },
    { $group: { _id: "$_id.user", stats: { $push: { k: "$_id.status", v: "$count" } }, total: { $sum: "$count" } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        email: "$user.email",
        total: 1,
        stats: { $arrayToObject: "$stats" },
      },
    },
    { $sort: { name: 1 } },
  ]);
  res.json(report);
};
