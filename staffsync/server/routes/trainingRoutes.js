const express = require("express");
const c = require("../controllers/trainingController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(c.getTrainings).post(authorize("Manager"), c.createTraining);
router.route("/:id").put(authorize("Manager"), c.updateTraining).delete(authorize("Manager"), c.deleteTraining);

module.exports = router;
