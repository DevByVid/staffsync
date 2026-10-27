const express = require("express");
const c = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(c.getAnnouncements).post(authorize("HR", "Manager"), c.createAnnouncement);
router
  .route("/:id")
  .put(authorize("HR", "Manager"), c.updateAnnouncement)
  .delete(authorize("HR", "Manager"), c.deleteAnnouncement);

module.exports = router;
