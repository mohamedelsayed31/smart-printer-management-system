const express = require("express");
const router = express.Router();

const { recordSale } = require("../controllers/salesControllers");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.use(protect);

// تسجيل عملية بيع جديدة
router.post("/", recordSale);

// ممكن مستقبلاً تضيف مسار يمسح مبيعات (للمدير فقط)
// router.delete("/:id", adminOnly, deleteSale);

module.exports = router;