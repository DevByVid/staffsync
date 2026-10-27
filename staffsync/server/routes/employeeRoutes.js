const express = require("express");
const c = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect, authorize("HR"));

router.route("/").get(c.getEmployees).post(c.createEmployee);
router.route("/:id").get(c.getEmployee).put(c.updateEmployee).delete(c.deleteEmployee);

module.exports = router;
