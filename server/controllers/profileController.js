const moment = require("moment");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const PrintJob = require("../models/PrintJob");
const Waste = require("../models/Waste");

const getMyProfile = async (req, res) => {
  try {
    const user = req.user;
    const employee = await Employee.findOne({ userId: user._id });
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const [attendance, jobs, waste] = await Promise.all([
      employee
        ? Attendance.find({
            employeeId: employee._id,
            checkIn: { $gte: startOfMonth, $lte: endOfMonth },
          }).select("workingHours")
        : [],
      PrintJob.find({
        employee: user._id,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).select("totalPrice"),
      Waste.find({
        employeeId: user._id,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).select("wastedSheets"),
    ]);

    const totalHoursThisMonth = attendance.reduce(
      (sum, row) => sum + Number(row.workingHours || 0),
      0
    );
    const totalRevenueGenerated = jobs.reduce(
      (sum, row) => sum + Number(row.totalPrice || 0),
      0
    );
    const totalWastedSheets = waste.reduce(
      (sum, row) => sum + Number(row.wastedSheets || 0),
      0
    );

    return res.json({
      success: true,
      user: {
        fullName: employee?.fullName || user.username,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
      },
      stats: {
        totalHoursThisMonth: Number(totalHoursThisMonth.toFixed(2)),
        totalJobsRegistered: jobs.length,
        totalRevenueGenerated: Number(totalRevenueGenerated.toFixed(2)),
        totalWastedSheets,
      },
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    return res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

module.exports = { getMyProfile };
