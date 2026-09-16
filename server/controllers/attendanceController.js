const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee"); 
const User = require("../models/User");
const moment = require("moment");

// الدالة المساعدة الذكية: تبحث عن الموظف أو تنشئه فوراً لو كان حساب إداري قديم
const getEmpIdByUserId = async (userId) => {
    let emp = await Employee.findOne({ userId });
    
    if (!emp) {
        const user = await User.findById(userId);
        if (!user) throw new Error("المستخدم غير موجود بالنظام.");
        
        // تعديل: التأكد من إعطاء الأولوية للـ fullName بشكل صحيح إذا لم يتوفر
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

// 1️⃣ تسجيل الحضور (React)
const checkIn = async (req, res) => {
    try {
        const userId = req.user.id; 
        const empId = await getEmpIdByUserId(userId); 
        
        const todayStr = moment().format("YYYY-MM-DD");
        const { lat, lng } = req.body; 

        const existingAttendance = await Attendance.findOne({
            employeeId: empId,
            date: todayStr,
        }).sort({ checkIn: -1 });

        if (existingAttendance) {
            const message = existingAttendance.checkOut
                ? "تم تسجيل حضورك وانصرافك لهذا اليوم بالفعل."
                : "أنت مسجل حضور بالفعل.";
            return res.status(400).json({ success: false, message });
        }

        const attendance = await Attendance.create({
            employeeId: empId, 
            date: todayStr,
            checkIn: new Date(),
            status: "Present",
            location: lat && lng ? { lat, lng } : undefined 
        });

        res.status(201).json({ success: true, message: "تم تسجيل الحضور بنجاح ✅", data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2️⃣ تسجيل الانصراف (React)
const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const empId = await getEmpIdByUserId(userId); 
        const { lat, lng } = req.body; 

        const todayStr = moment().format("YYYY-MM-DD");
        const attendance = await Attendance.findOne({
            employeeId: empId,
            date: todayStr,
            checkOut: { $exists: false },
        });

        if (!attendance) {
            return res.status(400).json({ success: false, message: "لا يوجد سجل حضور مفتوح." });
        }

        const checkOutTime = new Date();
        const duration = moment.duration(moment(checkOutTime).diff(moment(attendance.checkIn)));
        
        attendance.checkOut = checkOutTime;
        attendance.workingHours = parseFloat(duration.asHours().toFixed(2));
        
        if (lat && lng) {
            attendance.location = { lat, lng };
        }
        
        await attendance.save();

        res.status(200).json({ success: true, message: "تم تسجيل الانصراف بنجاح 👋", workingHours: attendance.workingHours });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3️⃣ فحص الحالة
const checkStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const empId = await getEmpIdByUserId(userId); 
        const todayStr = moment().format("YYYY-MM-DD");
        
        const record = await Attendance.findOne({
            employeeId: empId,
            date: todayStr,
        }).sort({ checkIn: -1 });

        res.json({
            isPresent: !!record && !record.checkOut,
            isCompletedToday: !!record?.checkOut,
        });
    } catch (err) {
        res.status(500).json({ isPresent: false });
    }
};

// 4️⃣ تقرير الإدمن (EJS)
const admin_attendance_get = async (req, res) => {
  try {
      const records = await Attendance.find()
          .populate({
              path: "employeeId",
              select: "fullName email username userId",
              populate: {
                  path: "userId",
                  select: "username"
              }
          })
          .sort({ createdAt: -1 });

      res.render("attendance/attendanceReports", { 
          records, 
          username: req.user.username, 
          currentPage: "attendance", 
          moment 
      });
  } catch (err) {
      console.error("Error in admin_attendance_get:", err);
      res.status(500).send("Internal Server Error");
  }
};

// دالة الحضور الإضافية
const employeeCheckIn = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const empId = await getEmpIdByUserId(userId); 
    const { lat, lng } = req.body; 

    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const existingCheckIn = await Attendance.findOne({
      employeeId: empId, 
      checkIn: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingCheckIn) {
      return res.status(400).json({ 
        success: false, 
        message: "Duplicate check-in is not allowed. You have already checked in today." 
      });
    }

    const newAttendance = await Attendance.create({
      employeeId: empId,
      date: moment().format("YYYY-MM-DD"),
      checkIn: new Date(),
      status: "On Time",
      location: lat && lng ? { lat, lng } : undefined 
    });

    res.status(201).json({ success: true, data: newAttendance });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5️⃣ تقارير الحضور المفلترة (EJS)
const getAttendanceReports = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    let filterQuery = {};

    if (employeeId) filterQuery.employeeId = employeeId;
    if (startDate && endDate) {
      filterQuery.checkIn = { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59') };
    }

    const reports = await Attendance.find(filterQuery)
      .populate({
          path: "employeeId",
          select: "fullName email username userId",
          populate: {
              path: "userId",
              select: "username"
          }
      })
      .sort({ checkIn: -1 });

    // تعديل: جلب كل من fullName و username لضمان القائمة المنسدلة لا تظهر فارغة
    const employees = await Employee.find().select("fullName username");

    res.render("attendance/attendanceReports", {
      reports,
      employees, 
      filters: req.query || {},
      moment,
      username: req.user ? req.user.username : "Admin", 
      currentPage: "attendance_reports"
    });
  } catch (err) {
    console.error("Error fetching attendance reports:", err);
    res.status(500).send("Error fetching reports");
  }
};

module.exports = { checkIn, checkOut, admin_attendance_get, checkStatus, employeeCheckIn, getAttendanceReports };