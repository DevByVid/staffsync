const Training = require("../models/Training");
const User = require("../models/User");

// Accepts a list (or comma-separated string) of user IDs or emails and returns user IDs
const isId = (v) => /^[a-f\d]{24}$/i.test(v);

const resolveAssignees = async (assignedTo) => {
  if (!assignedTo) return [];
  const list = Array.isArray(assignedTo) ? assignedTo : String(assignedTo).split(",");
  const values = list.map((v) => String(v).trim()).filter(Boolean);
  const ids = values.filter(isId);
  const emails = values.filter((v) => !isId(v)).map((v) => v.toLowerCase());
  const users = await User.find({ $or: [{ _id: { $in: ids } }, { email: { $in: emails } }] }).select("_id");
  if (users.length !== values.length) {
    const err = new Error("One or more assigned employees were not found");
    err.status = 400;
    throw err;
  }
  return users.map((u) => u._id);
};

const populate = (q) => q.populate("assignedTo", "name email").populate("createdBy", "name role");

// GET /api/trainings  (Manager, HR: all; Employee: assigned to them or open to all)
exports.getTrainings = async (req, res) => {
  const filter =
    req.user.role === "Employee"
      ? { $or: [{ assignedTo: req.user._id }, { assignedTo: { $size: 0 } }] }
      : {};
  const trainings = await populate(Training.find(filter)).sort({ date: 1 });
  res.json(trainings);
};

// POST /api/trainings  (Manager)
exports.createTraining = async (req, res) => {
  const { title, description, date, trainer, assignedTo } = req.body;
  const training = await Training.create({
    title,
    description,
    date,
    trainer: trainer || "TBD",
    createdBy: req.user._id,
    assignedTo: await resolveAssignees(assignedTo),
  });
  res.status(201).json(await populate(Training.findById(training._id)));
};

// PUT /api/trainings/:id  (Manager)
exports.updateTraining = async (req, res) => {
  const { title, description, date, trainer, assignedTo } = req.body;
  const update = { title, description, date, trainer };
  if (assignedTo !== undefined) update.assignedTo = await resolveAssignees(assignedTo);
  const training = await populate(
    Training.findByIdAndUpdate(req.params.id, update, { returnDocument: "after", runValidators: true })
  );
  if (!training) return res.status(404).json({ message: "Training not found" });
  res.json(training);
};

// DELETE /api/trainings/:id  (Manager)
exports.deleteTraining = async (req, res) => {
  const training = await Training.findByIdAndDelete(req.params.id);
  if (!training) return res.status(404).json({ message: "Training not found" });
  res.json({ message: "Training deleted" });
};
