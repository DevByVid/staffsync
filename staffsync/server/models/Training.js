const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Training title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    date: { type: Date, required: [true, "Training date is required"] },
    trainer: { type: String, default: "TBD" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Empty list = open to all employees
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Training = mongoose.model("Training", trainingSchema);
module.exports = Training;
