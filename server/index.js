require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// 1️ استيراد الـ Routes
const authRoutes = require("./routes/authRoutes"); 
const dashboardRoutes = require("./routes/dashboardRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const printerRoutes = require("./routes/printerRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const printJobRoutes = require("./routes/printJobRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const financialRoutes = require("./routes/financialRoutes");
const printingRoutes = require("./routes/printingRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const materialRoutes = require("./routes/materialRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
const port = process.env.PORT || 3001; 

// 2️ إعدادات الـ CORS (هامة جداً للربط مع React)
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true // للسماح بنقل الـ Cookies والـ Auth Headers
}));

// 3️ إعدادات الـ View Engine (للمدير)
app.set("view engine", "ejs");
app.use(express.static("public"));

// 4️ الـ Middlewares الأساسية
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // مهم جداً لاستقبال بيانات الـ JSON من React
app.use(cookieParser());

// 5️ الصفحة الرئيسية (Home/Login للمدير)
app.get("/", (req, res) => {
  res.render("home", {
    message: "",
    messageType: "",
    formType: "signin",
  });
});

// 6️ توجيه المسارات (API & Dashboard)
app.use("/auth", authRoutes); 
app.use("/", dashboardRoutes); 
app.use("/dashboard", employeeRoutes); 
app.use("/dashboard/printers", printerRoutes);
app.use("/dashboard/inventory", inventoryRoutes);
app.use("/dashboard/jobs", printJobRoutes);
app.use("/dashboard/attendance", attendanceRoutes);
app.use("/dashboard/financial", financialRoutes);
app.use("/dashboard/printing", printingRoutes);
app.use("/dashboard/waste", wasteRoutes);
app.use("/dashboard/materials", materialRoutes);
app.use("/dashboard/profile", profileRoutes);

// 7️ معالجة الأخطاء (يجب أن يكون آخر Middleware)
app.use(errorHandler);

// تشغيل السيرفر
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on: http://localhost:${port}/`);
  });
});