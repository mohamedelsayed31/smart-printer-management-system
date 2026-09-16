const express = require("express");
const router = express.Router();

// 1️⃣ استدعاء الدوال من الكنترولر
// تأكد من إضافة user_signup_post لو موجودة في الكنترولر عندك
const { 
    user_signin_post, 
    user_signup_post, 
    user_signout_get 
} = require("../controllers/userControllers");

// 2️⃣ استدعاء الميدل ويرز
const { protect } = require("../middlewares/authMiddleware");
const { validateLogin } = require("../validators/authValidator");

// مسار تسجيل الدخول (Sign In)
// خليناه /signin عشان يطابق الـ action اللي في الـ EJS
router.post("/signin", validateLogin, user_signin_post);

// مسار إنشاء حساب جديد (Sign Up)
// ضيفنا ده عشان الفورم التانية اللي في الـ home.ejs تشتغل
router.post("/signup", user_signup_post);

// مسار تسجيل الخروج
router.get("/logout", user_signout_get);

// مسار جلب بيانات المستخدم الحالي (Profile)
router.get("/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;