const express = require("express");
const c = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/checkin", c.checkIn);
router.post("/checkout", c.checkOut);
router.get("/my", c.getMyAttendance);
router.get("/today", c.getToday);
router.get("/report", authorize("HR"), c.getReport);
router.get("/", authorize("HR"), c.getAllAttendance);

module.exports = router;
