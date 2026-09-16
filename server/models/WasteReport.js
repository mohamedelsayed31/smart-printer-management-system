const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Schema (the structure of the waste report)
const wasteReportSchema = new Schema(
  {
    // العلاقة الأولى: لمعرفة الموظف المسؤول عن البلاغ
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    // العلاقة الثانية: لمعرفة الطابعة اللي حصل عليها المشكلة
    printerId: {
      type: Schema.Types.ObjectId,
      ref: "printer",
      required: true,
    },
    description: {
      type: String,
      required: true, // وصف المشكلة أو العطل اللي سبب الهالك
    },
    wastedSheets: {
      type: Number,
      required: true,
      default: 0, // عدد الورق التالف
    },
    faultType: {
      type: String,
      enum: ["employee_fault", "printer_fault"], // خطأ بشري ولا عطل فني
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed"], // حالة البلاغ (قيد المراجعة ولا تمت مراجعته)
      default: "pending",
    },
  },
  {
    // الخاصية دي هتنشئ حقل createdAt (اللي طلبته) بالإضافة لـ updatedAt أوتوماتيكياً
    timestamps: true,
  }
);

// Create a model based on that schema
const WasteReport = mongoose.model("wasteReport", wasteReportSchema);

// export the model
module.exports = WasteReport;