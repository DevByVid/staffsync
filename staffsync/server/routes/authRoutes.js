const express = require("express");
const { register, login, getMe, updateMe, listUsers } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.route("/me").get(protect, getMe).put(protect, updateMe);
router.get("/users", protect, authorize("HR", "Manager"), listUsers);

module.exports = router;
