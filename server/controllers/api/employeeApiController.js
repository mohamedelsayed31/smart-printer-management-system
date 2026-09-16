const Attendance = require("../../models/Attendance");
const Employee = require("../../models/Employee"); 
const User = require("../../models/User");
const moment = require("moment");

// الدالة المساعدة للتأكد من جلب الـ Employee ID الصحيح
const getEmpIdByUserId = async (userId) => {
    let emp = await Employee.findOne({ userId });
    
    if (!emp) {
        const user = await User.findById(userId);
        if (!user) throw new Error("المستخدم غير موجود بالنظام.");
        
        emp = await Employee.create({
            userId: user._id,
            fullName: user.fullName || user.username, 
            email: user.email,
            salary: 0, 
            role: user.role || "employee",
            status: "active"
        });
    }
    
    return emp._id;
};

const checkIn = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; // المعرف القادم من الـ Token (جدول User)
    
    // الحل السحري: تحويل الـ User ID إلى Employee ID الصحيح الخاص بـ "adam ahmed"
    const employeeId = await getEmpIdByUserId(userId); 
    
    const today = moment().format("YYYY-MM-DD");

    // نتحقق لو الموظف عمل Check-in قبل كدة النهاردة بناءً على معرف الموظف الصحيح
    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing) {
      return res.status(400).json({ message: "You already checked in today!" });
    }

    // إنشاء السجل بالـ employeeId الصحيح التابع لجدول الموظفين
    const newRecord = await Attendance.create({
      employeeId,
      date: today,
      checkIn: new Date(),
      status: "Present" // للتوافق مع الفلاتر والـ EJS
    });

    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { checkIn };