const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  itemName: { type: String, required: true }, // اسم الخامة (ورق A4، حبر HP 80A)
  category: { 
    type: String, 
    enum: ["Paper", "Ink", "Hardware", "Other"], 
    required: true 
  },
  unit: { type: String, default: "Piece" }, // وحدة القياس (Box, Rim, Piece, Liter)
  quantity: { type: Number, default: 0 }, // الكمية الحالية في المخزن
  minQuantity: { type: Number, default: 5 }, // حد الأمان (السيستم ينبهك لو قل عنه)
  
  // 💰 التعديلات الجوهرية للأسعار:
  costPrice: { type: Number, required: true }, // سعر التكلفة (اللي وقف عليك بيه - عشان نحسب منه الأرباح)
  sellingPrice: { type: Number, required: true, default: 1 }, // سعر البيع للعميل (اللي الآلة الحاسبة بتستخدمه في صفحة الإضافة)

  // 📦 إضافات بيزنس هتخلي السيستم احترافي:
  supplierName: { type: String, default: "غير محدد" }, // اسم المورد أو المكتبة اللي بنشتري منها
  lastRestockDate: { type: Date } // تاريخ آخر تزويد للمخزن (هينفعنا في التقارير)

}, { timestamps: true });

module.exports = mongoose.model("inventory", inventorySchema); 
// ملاحظة: يفضل اسم الموديل يبدأ بحرف كابيتال Inventory