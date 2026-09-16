const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Schema (the structure of the inventory movement)
const inventoryMovementSchema = new Schema(
  {
    // العلاقة: InventoryMovement belongsTo Material
    materialId: {
      type: Schema.Types.ObjectId,
      ref: "material", // الربط مع موديل الخامات Material.js
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT", "WASTE"], // الحالات المسموح بها فقط
      required: true,
    },
    quantity: {
      type: Number,
      required: true, // الكمية التي تحركت
    },
    reason: {
      type: String, // شرح السبب (مثلاً: "أمر طباعة رقم #101" أو "تلف نسيج الورق")
    },
    date: {
      type: Date,
      default: Date.now, // تاريخ الحركة
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt (مهم جداً للتدقيق المالي والزمني)
  }
);

// Create a model based on that schema
const InventoryMovement = mongoose.model("inventoryMovement", inventoryMovementSchema);

// export the model
module.exports = InventoryMovement;