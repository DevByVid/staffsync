const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    message: { type: String, required: [true, "Message is required"] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetAudience: { type: String, enum: ["All", "Employees", "Managers"], default: "All" },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
