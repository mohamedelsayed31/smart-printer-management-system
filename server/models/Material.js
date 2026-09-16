const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true }, // مثال: كوشيه 150 جرام
  paperSize: { type: String, enum: ['A4', 'A3', 'Other'], default: 'A4' },
  costPrice: { type: Number, required: true }, // سعر الورقة الواحدة تكلفة
  sellingPrice: { type: Number, required: true }, // سعر الورقة الواحدة بيع
  stockLimit: { type: Number, default: 100 }, // حد الأمان عشان ينبهك لما يخلص
});

module.exports = mongoose.model("Material", materialSchema);