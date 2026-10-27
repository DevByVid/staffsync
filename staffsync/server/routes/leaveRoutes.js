const express = require("express");
const c = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.post("/", authorize("Employee"), c.applyLeave);
router.get("/my", authorize("Employee"), c.getMyLeaves);
router.get("/", authorize("HR", "Manager"), c.getAllLeaves);
router.put("/:id/status", authorize("HR", "Manager"), c.updateLeaveStatus);
router.delete("/:id", authorize("Employee"), c.cancelLeave);

module.exports = router;
