const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const inventoryController = require("../controllers/inventoryController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", protect, adminOnly, inventoryController.inventory_index_get);
router.get("/add", protect, adminOnly, inventoryController.inventory_add_get);
router.post("/add", protect, adminOnly, inventoryController.inventory_create_post);
router.get("/edit/:id", protect, adminOnly, inventoryController.inventory_edit_get);
router.post("/update/:id", protect, adminOnly, inventoryController.inventory_update_post);
router.post("/add-stock/:id", protect, adminOnly, inventoryController.inventory_addstock_post);
router.post("/delete/:id", protect, adminOnly, inventoryController.inventory_delete_post);
router.get("/api/all", protect, async (req, res) => {
    try {
        // جلب الأصناف اللي تصنيفها ورق وموجود منها كمية
        const items = await Inventory.find({ category: "Paper" }); 
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Error fetching inventory" });
    }
});
module.exports = router;