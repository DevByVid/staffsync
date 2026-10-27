const Employee = require("../models/Employee");
const User = require("../models/User");

// GET /api/employees
exports.getEmployees = async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
};

// GET /api/employees/:id
exports.getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  const data = { ...req.body };
  // Link to an existing login account with the same email, if there is one
  const linked = await User.findOne({ email: (data.email || "").toLowerCase() });
  if (linked) data.user = linked._id;
  const employee = await Employee.create(data);
  res.status(201).json(employee);
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json({ message: "Employee deleted" });
};
