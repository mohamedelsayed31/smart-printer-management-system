const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeControllers");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// مهم: لا نستخدم router.use(protect, adminOnly) هنا لأن هذا الـrouter
// مركّب على /dashboard، وبالتالي كان يعترض أي مسار مثل
// /dashboard/attendance و /dashboard/profile قبل وصوله للـrouter الصحيح.
// نطبّق الصلاحيات فقط على مسارات إدارة الموظفين الفعلية.

// 1. عرض قائمة الموظفين
router.get(
  "/employees",
  protect,
  adminOnly,
  employeeController.employee_dashboard_get
);

// 2. البحث عن موظف
router.post(
  "/search",
  protect,
  adminOnly,
  employeeController.employee_search_post
);

// 3. إضافة موظف جديد
router.get(
  "/add",
  protect,
  adminOnly,
  employeeController.employee_add_get
);
router.post(
  "/add",
  protect,
  adminOnly,
  employeeController.employee_create_post
);

// 4. عرض بيانات موظف
router.get(
  "/view/:id",
  protect,
  adminOnly,
  employeeController.employee_view_get
);

// 5. تعديل بيانات موظف
router.get(
  "/edit/:id",
  protect,
  adminOnly,
  employeeController.employee_edit_get
);
router.post(
  "/update/:id",
  protect,
  adminOnly,
  employeeController.employee_update_post
);

// 6. حذف موظف
router.post(
  "/delete/:id",
  protect,
  adminOnly,
  employeeController.employee_delete_post
);

module.exports = router;
