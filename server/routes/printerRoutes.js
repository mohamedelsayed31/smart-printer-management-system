const express = require("express");
const router = express.Router();
const printerController = require("../controllers/printerController");
const Printer = require("../models/Printer");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// كل المسارات هنا هتبدأ بـ /dashboard/printers (هنحدد ده في index.js)
router.get("/", protect, adminOnly, printerController.printer_index_get);
router.get("/add", protect, adminOnly, printerController.printer_add_get);
router.post("/add", protect, adminOnly, printerController.printer_create_post);
router.get("/edit/:id", protect, adminOnly, printerController.printer_edit_get);
router.post(
  "/update/:id",
  protect,
  adminOnly,
  printerController.printer_update_post
);
router.post(
  "/delete/:id",
  protect,
  adminOnly,
  printerController.printer_delete_post
);
router.get("/api/all", protect, async (req, res) => {
  try {
    const printers = await Printer.find({ status: "active" }); // تأكد من كلمة active (سمول أو كابيتال حسب تسجيلك)
    res.json(printers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching printers" });
  }
});
module.exports = router;
