const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Schema (the structure of the deduction)
const deductionSchema = new Schema(
  {
    // العلاقة الأولى: الخصم تابع لمين؟ (Employee)
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    // العلاقة التانية: هل الخصم ده بسبب بلاغ إتلاف معين؟ (WasteReport)
    wasteReportId: {
      type: Schema.Types.ObjectId,
      ref: "wasteReport",
      // ملحوظة: مكتبتش هنا (required: true) عشان ممكن يكون الخصم لسبب تاني غير الإتلاف (زي الغياب أو التأخير مثلاً)
    },
    amount: {
      type: Number,
      required: true, // قيمة الخصم المالي
    },
    reason: {
      type: String,
      required: true, // سبب الخصم (مثال: "بناءً على بلاغ إتلاف رقم كذا" أو "تأخير ساعتين")
    },
    date: {
      type: Date,
      default: Date.now, // تاريخ توقيع الخصم
    },
  },
  {
    timestamps: true, // بيسجل وقت الإنشاء والتعديل أوتوماتيكياً
  }
);

// Create a model based on that schema
const Deduction = mongoose.model("deduction", deductionSchema);

// export the model
module.exports = Deduction;