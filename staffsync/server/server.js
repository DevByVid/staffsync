const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ quiet: true });

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const trainingRoutes = require("./routes/trainingRoutes");

const app = express();

// CLIENT_URL can be a comma-separated list, e.g. "http://localhost:5173,https://staffsync.vercel.app"
const allowed = (process.env.CLIENT_URL || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Express 5 leaves req.body undefined when there is no body
app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/trainings", trainingRoutes);

app.get("/", (req, res) => {
  res.send("StaffSync HRM Backend Running...");
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Central error handler (Express 5 forwards async errors here automatically)
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: `Duplicate value for ${Object.keys(err.keyValue).join(", ")}` });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" });
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;
