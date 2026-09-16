const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

router.get("/", protect, adminOnly, wasteController.admin_waste_get);
router.post("/add", protect, wasteController.createWasteReport);
router.post(
  "/add-with-ai",
  protect,
  upload.single("image"),
  wasteController.createWasteReportWithAI
);

module.exports = router;
