const express = require("express");
const router = express.Router();
const jobController = require("../controllers/printJobController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// مسارات الـ EJS (المدير)
router.get("/", protect, adminOnly, jobController.job_index_get);
router.get("/add", protect, adminOnly, jobController.job_add_get);
router.post("/add", protect, adminOnly, jobController.job_create_post);

// مسارات الـ API (الموظف - React)
router.post("/api/add", protect, jobController.createPrintJob);

module.exports = router;