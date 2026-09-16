const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  printerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "printer",
    required: true,
  },
  wastedSheets: {
    type: Number,
    required: true,
    min: 1,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  faultType: {
    type: String,
    enum: ["Machine", "Employee", "Unknown"],
    default: "Unknown",
  },
  aiExplanation: {
    type: String,
    default: "",
  },
  aiProvider: {
    type: String,
    enum: ["Gemini", "Groq", "None"],
    default: "None",
  },
  aiStatus: {
    type: String,
    enum: ["analyzed", "failed", "skipped"],
    default: "skipped",
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Waste", wasteSchema);
