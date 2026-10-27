const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  phone: user.phone,
  address: user.address,
});

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: "User already exists with this email" });

  const user = await User.create({ name, email, password, role, department });
  res.status(201).json({ token: generateToken(user._id), user: userPayload(user) });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: generateToken(user._id), user: userPayload(user) });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(userPayload(req.user));
};

// PUT /api/auth/me  - employees maintain their own personal record
exports.updateMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, department, phone, address, password } = req.body;
  if (name) user.name = name;
  if (department !== undefined) user.department = department;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (password) {
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    user.password = password;
  }
  await user.save();
  res.json(userPayload(user));
};

// GET /api/auth/users?role=Employee  (HR / Manager) - used for training assignment dropdowns
exports.listUsers = async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).select("name email role department").sort({ name: 1 });
  res.json(users);
};
