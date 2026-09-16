const Material = require("../models/Material");
const InventoryMovement = require("../models/InventoryMovement");

const deductInventory = async (materialId, quantity, reason, type = "OUT") => {
  const material = await Material.findById(materialId);
  
  if (!material || material.quantity < quantity) {
    throw new Error(`رصيد خامة ${material?.name || ''} لا يكفي.`);
  }

  // نخصم الكمية
  material.quantity -= quantity;
  await material.save();

  // نسجل الحركة في تقرير المخزن
  await InventoryMovement.create({
    materialId,
    type,
    quantity,
    reason,
  });

  return material;
};

module.exports = { deductInventory };