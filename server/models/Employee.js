const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    salary: { type: Number, required: true },
    role: { type: String, default: "employee" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    hireDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", employeeSchema);