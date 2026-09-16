const Inventory = require("../models/Inventory");

// عرض المخزن
const inventory_index_get = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.render("inventory/index", { // تأكد إن المسار inventory/index صح حسب فولدراتك
      arr: items,
      username: req.user.username,
      currentPage: "inventory",
    });
  } catch (err) {
    res.status(500).send("Error loading inventory");
  }
};

// صفحة إضافة صنف جديد
const inventory_add_get = (req, res) => {
  res.render("inventory/add", {
    username: req.user.username,
    currentPage: "inventory",
  });
};

// حفظ الصنف الجديد
const inventory_create_post = async (req, res) => {
  try {
    // نضمن إن الأرقام تتسيف كأرقام مش نصوص
    const data = {
      ...req.body,
      quantity: Number(req.body.quantity),
      costPrice: Number(req.body.costPrice),
      sellingPrice: Number(req.body.sellingPrice),
      minQuantity: Number(req.body.minQuantity)
    };
    await Inventory.create(data);
    res.redirect("/dashboard/inventory");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error adding item to inventory");
  }
};

// صفحة التعديل
const inventory_edit_get = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    res.render("inventory/edit", {
      obj: item,
      username: req.user.username,
      currentPage: "inventory",
    });
  } catch (err) {
    res.status(500).send("Error loading item");
  }
};

// تنفيذ التعديل
const inventory_update_post = async (req, res) => {
  try {
    const data = {
      ...req.body,
      quantity: Number(req.body.quantity),
      costPrice: Number(req.body.costPrice),
      sellingPrice: Number(req.body.sellingPrice),
      minQuantity: Number(req.body.minQuantity)
    };
    await Inventory.findByIdAndUpdate(req.params.id, data);
    res.redirect("/dashboard/inventory");
  } catch (err) {
    res.status(400).send("Error updating item");
  }
};

// تنفيذ تزويد الكمية
const inventory_addstock_post = async (req, res) => {
  try {
    const { additionalQuantity } = req.body;
    const item = await Inventory.findById(req.params.id);
    item.quantity += Number(additionalQuantity);
    await item.save();
    res.redirect("/dashboard/inventory");
  } catch (err) {
    res.status(400).send("Error adding stock");
  }
};

// حذف صنف
const inventory_delete_post = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/inventory");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting item");
  }
};

module.exports = {
  inventory_index_get,
  inventory_add_get,
  inventory_create_post,
  inventory_edit_get,
  inventory_update_post,
  inventory_addstock_post,
  inventory_delete_post
};