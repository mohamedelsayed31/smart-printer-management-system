const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const printerSchema = new Schema(
  {
    name: { type: String, required: true }, // اسم الطابعة (مثلاً: HP Laserjet 400)
    model: String,
    ipAddress: String, // لو الطابعة واصلة بالشبكة
    status: {
      type: String,
      enum: ["active", "maintenance", "out_of_service"],
      default: "active",
    },
    counter: { type: Number, default: 0 }, // عداد الورق الإجمالي اللي طبعته
    lastMaintenance: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("printer", printerSchema);
