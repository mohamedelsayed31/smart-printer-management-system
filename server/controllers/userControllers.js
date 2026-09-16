const Userdata = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES_IN, COOKIE_MAX_AGE } = require("../config/jwt");

// 1️⃣ Sign Up
const user_signup_post = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render("home", {
        message: "All fields are required",
        messageType: "error",
        formType: "signup",
      });
    }

    const oldUser = await Userdata.findOne({ email });
    if (oldUser) {
      return res.render("home", {
        message: "Email already exists",
        messageType: "error",
        formType: "signup",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Userdata({
      username,
      email,
      password: hashedPassword,
      role: "employee" // الموظف الجديد بياخد صلاحيات عادية افتراضياً
    });

    await newUser.save();

    return res.render("home", {
      message: "User registered successfully, please sign in",
      messageType: "success",
      formType: "signin",
    });
  } catch (err) {
    console.log(err);
    return res.render("home", {
      message: "Server error",
      messageType: "error",
      formType: "signup",
    });
  }
};

// 2️⃣ Sign In
const user_signin_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. التحقق من المدخلات
    if (!email || !password) {
      if ((req.headers.accept || "").includes("application/json")) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      return res.render("home", { message: "Email and password are required", messageType: "error", formType: "signin" });
    }

    // 2. البحث عن المستخدم
    const user = await Userdata.findOne({ email });
    if (!user) {
      if ((req.headers.accept || "").includes("application/json")) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.render("home", { message: "User not found", messageType: "error", formType: "signin" });
    }

    // 3. مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      if ((req.headers.accept || "").includes("application/json")) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      return res.render("home", { message: "Incorrect password", messageType: "error", formType: "signin" });
    }

    // 4. إنشاء الـ Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, username: user.username },
      SECRET_KEY, 
      { expiresIn: EXPIRES_IN }
    );

    // 5. الرد بناءً على نوع الطلب
    // إذا كان الطلب من React (بيبعت Header بطلب JSON)
    if ((req.headers.accept || "").includes("application/json") || req.originalUrl.includes('/api/')) {
       return res.status(200).json({
         success: true,
         token: token,
         user: { id: user._id, username: user.username, email: user.email, role: user.role }
       });
    }

    // إذا كان الطلب من الـ Browser العادي (EJS)
    res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", maxAge: COOKIE_MAX_AGE });
    
    // 💡 التوجيه الذكي (Smart Redirect)
    if (user.role === 'admin') {
      return res.redirect("/dashboard"); // المدير يروح للداشبورد الرئيسي
    } else {
      return res.redirect("/dashboard/jobs/add"); // الموظف يروح فوراً لصفحة تسجيل الطباعة
    }

  } catch (err) {
    console.log(err);
    if ((req.headers.accept || "").includes("application/json")) {
        return res.status(500).json({ message: "Server error" });
    }
    return res.render("home", { message: "Server error", messageType: "error", formType: "signin" });
  }
};

// 3️⃣ Sign Out
const user_signout_get = (req, res) => {
  res.clearCookie("jwt"); 
  res.redirect("/"); 
};

module.exports = { user_signup_post, user_signin_post, user_signout_get };