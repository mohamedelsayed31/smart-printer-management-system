const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// حماية كل المسارات
router.use(protect);

// للموظف (React)
router.get("/status", attendanceController.checkStatus);
router.post("/check-in", attendanceController.checkIn);   
router.post("/check-out", attendanceController.checkOut);
// للمدير (EJS)
router.get("/report", adminOnly, attendanceController.admin_attendance_get);

router.get("/reports", protect, adminOnly, attendanceController.getAttendanceReports);

module.exports = router;