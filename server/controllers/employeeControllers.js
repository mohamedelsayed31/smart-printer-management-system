const bcrypt = require("bcryptjs"); // أو bcrypt حسب اللي بتستخدمه
const Userdata = require("../models/User"); // تأكد من استيراد موديل اليوزر
const Employee = require("../models/Employee"); 
const moment = require("moment");

// 1. عرض لوحة التحكم (الجدول الرئيسي)
const employee_dashboard_get = async (req, res) => {
  try {
    const employees = await Employee.find(); // شلنا الـ populate لو مش ضروري حالياً لتسريع الأداء

    res.render("employee/index", {
      arr: employees,
      username: req.user ? req.user.username : "Admin", // سحب الاسم من الـ Middleware
      currentPage: "employees",
      moment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading employee dashboard");
  }
};

// 2. عرض صفحة إضافة موظف
const employee_add_get = (req, res) => {
  res.render("employee/add", {
    username: req.user ? req.user.username : "Admin",
    currentPage: "add"
  });
};

// 3. إنشاء موظف جديد (حفظ البيانات)
const employee_create_post = async (req, res) => {
  try {
    const { fullName, email, password, phone, salary } = req.body;

    // 1. إنشاء حساب الدخول في جدول الـ User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Userdata.create({
      username: fullName,
      email: email,
      password: hashedPassword,
      role: "employee" // الأدمن بيضيف موظف دايماً
    });

    // 2. إنشاء البيانات الوظيفية في جدول الـ Employee وربطه باليوزر
    await Employee.create({
      userId: newUser._id, // ربط السجل بحساب الدخول اللي لسه مكرينه
      fullName,
      email,
      phone,
      salary,
      role: "employee"
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log("Error logic:", err);
    res.status(400).send("حدث خطأ أثناء إنشاء الحساب والبيانات.");
  }
};

// 4. عرض بيانات موظف معين
const employee_view_get = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("Employee not found");

    res.render("employee/view", {
      obj: employee,
      username: req.user ? req.user.username : "Admin",
      currentPage: "view",
      moment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// 5. عرض صفحة التعديل
const employee_edit_get = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send("Employee not found");

    res.render("employee/edit", {
      obj: employee,
      username: req.user ? req.user.username : "Admin",
      currentPage: "edit",
      moment
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading edit page");
  }
};

// 6. تحديث بيانات موظف
const employee_update_post = async (req, res) => {
  try {
    const { fullName, email, phone, salary, status, role, password } = req.body;
    
    // 1. تحديث بيانات الموظف في جدول الـ Employee (بما فيها الإيميل الجديد)
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    // 2. تجهيز البيانات اللي هتتحدث في جدول الـ User
    const userUpdateData = {
      username: fullName,
      email: email,
      role: role
    };

    // 3. لو فيه باسورد جديدة
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      userUpdateData.password = hashedPassword;
    }

    // 4. التحديث في جدول الـ User باستخدام الـ userId المربوط بالسجل
    await Userdata.findByIdAndUpdate(updatedEmployee.userId, userUpdateData);

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    // لو الإيميل الجديد موجود عند حد تاني، المونجوس هيطلع Error
    if (err.code === 11000) {
       return res.status(400).send("هذا الإيميل مستخدم بالفعل من قبل موظف آخر");
    }
    res.status(400).send("Error updating employee credentials");
  }
};

// 7. حذف موظف
const employee_delete_post = async (req, res) => {
  try {
    // 1. نجيب بيانات الموظف كاملة الأول عشان نعرف الـ userId بتاعه
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    console.log("Deleting User with ID:", employee.userId); // سطر للتأكد في الـ Terminal

    // 2. حذف حساب الدخول أولاً من جدول الـ User
    if (employee.userId) {
      await Userdata.findByIdAndDelete(employee.userId);
    }

    // 3. حذف بيانات الموظف من جدول الـ Employee
    await Employee.findByIdAndDelete(req.params.id);

    res.redirect("/dashboard");
  } catch (err) {
    console.log("Delete Error:", err);
    res.status(500).send("Error deleting employee and user account");
  }
};

// 8. دالة البحث (اللي كانت مسببة الـ Crash)
const employee_search_post = async (req, res) => {
  try {
    const searchText = req.body.searchText.trim();
    // البحث في اسم الموظف أو رقم تليفونه
    const employees = await Employee.find({
      $or: [
        { fullName: { $regex: searchText, $options: "i" } },
        { phone: { $regex: searchText, $options: "i" } }
      ]
    });

    res.render("employee/search", {
      arr: employees,
      username: req.user ? req.user.username : "Admin",
      currentPage: "search",
      moment
    });
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
};

// ==========================================
//                 APIs
// ==========================================

const employee_readallapi_get = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ data: employees });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const employee_readidapi_get = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ data: employee });
  } catch (err) {
    res.status(500).json({ message: "Invalid ID" });
  }
};

// تصدير جميع الدوال
module.exports = {
  employee_dashboard_get,
  employee_add_get,
  employee_create_post,
  employee_view_get,
  employee_edit_get,
  employee_update_post,
  employee_delete_post,
  employee_search_post, // ضفناها هنا
  employee_readallapi_get,
  employee_readidapi_get,
};