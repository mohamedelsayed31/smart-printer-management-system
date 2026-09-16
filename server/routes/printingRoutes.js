const express = require("express");
const router = express.Router();
const printingController = require("../controllers/printReportController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// مسار تقارير عمليات الطباعة
// URL: /dashboard/printing/reports
router.get("/reports", protect, adminOnly, printingController.getPrintingReports);

module.exports = router;