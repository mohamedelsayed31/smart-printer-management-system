const express = require("express");
const router = express.Router();
const financialController = require("../controllers/financialController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// مسار التقارير المالية للمدير
// URL: /dashboard/financial/report
router.get("/report", protect, adminOnly, financialController.getFinancialReport);

module.exports = router;