const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET_KEY } = require("../config/jwt"); // استيراد المفتاح الموحد

const protect = async (req, res, next) => {
    let token;

    // 1. التعديل السحري: إعطاء الأولوية للهيدرز (React) ثم الكوكيز (EJS)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // 2. لو مفيش توكن خالص
    if (!token) {
        // التحقق من نوع الطلب (API ولا متصفح)
        if (req.originalUrl.startsWith("/api") || (req.headers.accept && req.headers.accept.includes("application/json"))) {
            return res.status(401).json({ success: false, message: "غير مسموح بالدخول، لا يوجد توكن" });
        }
        // لو متصفح، ارجع لصفحة اللوجين
        return res.redirect("/");
    }

    try {
        // 3. فك التشفير والتأكد من صحة التوكن باستخدام المفتاح الموحد
        const decoded = jwt.verify(token, SECRET_KEY || process.env.JWT_SECRET);
        
        // 4. جلب بيانات المستخدم من الداتابيز
        const currentUser = await User.findById(decoded.id).select("-password");
        if (!currentUser) {
            if (req.originalUrl.startsWith("/api") || (req.headers.accept && req.headers.accept.includes("application/json"))) {
                return res.status(401).json({ success: false, message: "المستخدم غير موجود" });
            }
            res.clearCookie("jwt");
            return res.redirect("/");
        }

        // 5. حفظ البيانات في الطلب (الريكويست)
        req.user = currentUser;
        
        // عشان نستخدمها في الـ Sidebar بسهولة من غير ما نبعتها من كل كنترولر
        res.locals.username = currentUser.username;
        res.locals.userRole = currentUser.role;

        next();
    } catch (error) {
        if (req.originalUrl.startsWith("/api") || (req.headers.accept && req.headers.accept.includes("application/json"))) {
            return res.status(401).json({ success: false, message: "توكن غير صالح أو منتهي الصلاحية" });
        }
        res.clearCookie("jwt");
        return res.redirect("/");
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next(); 
    } else {
        // لو موظف عادي حاول يدخل على لينكات الإدارة (زي التقارير)
        if (req.originalUrl.startsWith("/api") || (req.headers.accept && req.headers.accept.includes("application/json"))) {
            return res.status(403).json({ success: false, message: "غير مصرح لك. هذه الصفحة للإدارة فقط." });
        }
        // لو متصفح، نرجعه للصفحة المسموحة ليه (إضافة عملية طباعة)
        return res.redirect("/dashboard/jobs/add"); 
    }
};

module.exports = { protect, adminOnly };