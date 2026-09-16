const PrintJob = require("../models/PrintJob");
const User = require("../models/User");
const moment = require("moment");

const getPrintingReports = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    let filterQuery = {};

    if (employeeId) filterQuery.employee = employeeId; // استخدمنا employee كما في الموديل

    if (startDate && endDate) {
      filterQuery.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate + 'T23:59:59') 
      };
    }

    const jobs = await PrintJob.find(filterQuery)
      .populate("employee", "username fullName") // الربط مع employee
      .populate("printer", "name")               // الربط مع printer
      .sort({ createdAt: -1 });

    const employees = await User.find().select("username fullName");

    res.render("printing/printingReports", {
      jobs: jobs || [],
      employees: employees || [],
      filters: req.query || {},
      moment: moment,
      username: req.user ? req.user.username : 'Admin',
      currentPage: "printing_reports"
    });

  } catch (err) {
    console.error("Error Detail:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports = { getPrintingReports };