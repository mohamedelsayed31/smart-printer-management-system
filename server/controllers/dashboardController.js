const Printer = require("../models/Printer");
const Inventory = require("../models/Inventory");
const PrintJob = require("../models/PrintJob");
const Employee = require("../models/Employee"); 
const Attendance = require("../models/Attendance");
const Waste = require("../models/Waste");
const moment = require("moment");

const dashboard_get = async (req, res) => {
  try {
    const startOfToday = moment().startOf("day").toDate();
    const todayStr = moment().format("YYYY-MM-DD");

    const [
      totalPrinters,
      totalEmployees,
      lowStockItems,
      jobsToday,
      allAttendanceToday,
      rawRecentJobs,
      wasteTodayRecords,
    ] = await Promise.all([
      Printer.countDocuments(),
      Employee.countDocuments(),
      Inventory.countDocuments({ $expr: { $lte: ["$quantity", "$minQuantity"] } }),
      PrintJob.find({ createdAt: { $gte: startOfToday } }),
      Attendance.find({ date: todayStr }).populate("employeeId"), 
      PrintJob.find().sort({ createdAt: -1 }).limit(5).populate("printer").populate("employee"),
      Waste.find({ createdAt: { $gte: startOfToday } }),
    ]);

    const dailyRevenue = jobsToday.reduce((acc, job) => acc + (job.totalPrice || 0), 0);
    const totalWastedSheets = wasteTodayRecords.reduce((acc, curr) => acc + (curr.quantity || curr.wastedSheets || 0), 0);

    // معالجة بيانات الحضور اليومي
    const staffStatus = allAttendanceToday.map(record => {
      let hours = record.workingHours || 0;
      if (!record.checkOut && record.checkIn) {
        const duration = moment.duration(moment().diff(moment(record.checkIn)));
        hours = parseFloat(duration.asHours().toFixed(2));
      }
      
      const emp = record.employeeId;
      let finalName = "Unknown Employee";

      if (emp) {
        // إذا وجد كائن الموظف، يبحث عن الاسم داخل الحقول الممكنة
        finalName = emp.fullName || emp.name || emp.username || emp.employeeName || "Staff Member";
      } else {
        // 🌟 حل مشكلة الأدمن: إذا كان الـ populate رجع null، فهذا يعني أن الحساب هو حساب الأدمن الحالي
        finalName = req.user ? (req.user.fullName || req.user.name || req.user.username || "Admin") : "Admin";
      }

      return {
        name: finalName,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        currentHours: hours || 0,
      };
    });

    // معالجة العمليات الأخيرة
    const recentJobs = rawRecentJobs.map(job => {
      const emp = job.employee;
      const finalJobName = emp ? (emp.fullName || emp.name || emp.username) : "System Admin";
      return {
        ...job._doc,
        employeeName: finalJobName,
      };
    });

    res.render("dashboard", {
      username: req.user ? (req.user.fullName || req.user.name || req.user.username) : "Admin",
      stats: {
        totalPrinters,
        totalEmployees,
        lowStockItems,
        dailyRevenue,
        totalJobsToday: jobsToday.length,
        presentToday: allAttendanceToday.length,
        totalWastedSheets,
      },
      staffStatus,
      recentJobs,
      currentPage: "dashboard",
      moment: moment,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { dashboard_get };