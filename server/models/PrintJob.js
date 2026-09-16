const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const printJobSchema = new Schema(
  {
    printer: { type: Schema.Types.ObjectId, ref: "printer", required: true },
    itemUsed: { type: Schema.Types.ObjectId, ref: "inventory", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "user", required: true }, 
    pagesCount: { type: Number, required: true },
    totalPrice: { type: Number, required: true }, // سعر البيع
    costPrice: { type: Number, default: 0 },      // 👈 أضف هذا الحقل لحساب الأرباح
    customerName: { type: String, default: "Guest" },
    jobDate: { type: Date, default: Date.now },
    sheetsUsed: { type: Number, required: true }, 
    paperType: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("printJob", printJobSchema);