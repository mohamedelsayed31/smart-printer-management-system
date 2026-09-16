const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Schema (the structure of the sale)
const saleSchema = new Schema(
  {
    // العلاقة: Sale belongsTo PrintJob
    printJobId: {
      type: Schema.Types.ObjectId,
      ref: "printJob", // الربط مع موديل أوامر الطباعة
      required: true,
      unique: true, // لضمان أن كل أمر طباعة يتم بيعه/تسجيله مرة واحدة فقط
    },
    sellingPrice: {
      type: Number,
      required: true, // سعر البيع للعميل
    },
    cost: {
      type: Number,
      required: true, // التكلفة (ممكن تحسبها من خامات + مصاريف تشغيل)
    },
    profit: {
      type: Number,
      required: true, // سيتم حسابه تلقائياً أو إدخاله
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * "Middleware" قبل الحفظ (Pre-save Hook)
 * وظيفتها حساب الربح تلقائياً من المعادلة (السعر - التكلفة) 
 * قبل ما البيانات تتخزن في الداتابيز
 */
saleSchema.pre("save", function (next) {
  this.profit = this.sellingPrice - this.cost;
  next();
});

// Create a model based on that schema
const Sale = mongoose.model("sale", saleSchema);

// export the model
module.exports = Sale;