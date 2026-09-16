const Waste = require("../models/Waste");
const User = require("../models/User");
const moment = require("moment");
const { analyzeWasteImage } = require("../services/wasteAIService");

// 1. Employee React API: smart waste report with AI image analysis.
const createWasteReportWithAI = async (req, res) => {
  try {
    const { printerId, wastedSheets, reason } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "رجاءً قم برفع صورة الورقة التالفة 📸",
      });
    }

    const sheets = Number(wastedSheets);
    if (!printerId || !Number.isFinite(sheets) || sheets < 1) {
      return res.status(400).json({
        success: false,
        message: "بيانات الطابعة أو عدد الورق التالف غير صحيحة",
      });
    }

    // Never blame an employee when the AI provider is unavailable.
    let faultType = "Unknown";
    let aiExplanation = "تعذر تشغيل التحليل الذكي؛ التقرير محفوظ للمراجعة اليدوية";
    let aiProvider = "None";
    let aiStatus = "failed";

    try {
      const analysis = await analyzeWasteImage(req.file.buffer, req.file.mimetype);
      faultType = analysis.decision;
      aiExplanation = analysis.explanation;
      aiProvider = analysis.provider;
      aiStatus = "analyzed";
      console.log(`✅ ${aiProvider} waste analysis:`, analysis);
    } catch (aiError) {
      console.error("⚠️ AI waste analysis failed:", aiError.message);
      aiExplanation = `تعذر التحليل الذكي: ${aiError.message}`;
    }

    const newReport = await Waste.create({
      employeeId: req.user._id,
      printerId,
      wastedSheets: sheets,
      reason: reason || "تم إرسال التقرير للفحص الذكي",
      faultType,
      aiExplanation,
      aiProvider,
      aiStatus,
      date: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: newReport,
      aiAnalysis: {
        decision: faultType,
        explanation: aiExplanation,
        provider: aiProvider,
        status: aiStatus,
      },
    });
  } catch (err) {
    console.error("Main Waste Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ غير متوقع في السيرفر",
    });
  }
};

// 2. Manual waste report.
const createWasteReport = async (req, res) => {
  try {
    const { printerId, wastedSheets, reason } = req.body;
    const sheets = Number(wastedSheets);

    if (!printerId || !Number.isFinite(sheets) || sheets < 1 || !reason) {
      return res.status(400).json({ success: false, message: "بيانات التقرير غير مكتملة" });
    }

    const newReport = await Waste.create({
      employeeId: req.user._id,
      printerId,
      wastedSheets: sheets,
      reason,
      faultType: "Unknown",
      aiProvider: "None",
      aiStatus: "skipped",
      date: new Date(),
    });

    res.status(201).json({ success: true, data: newReport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Admin EJS report view.
const admin_waste_get = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const filterQuery = {};

    if (employeeId) filterQuery.employeeId = employeeId;
    if (startDate && endDate) {
      filterQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(`${endDate}T23:59:59`),
      };
    }

    const reports = await Waste.find(filterQuery)
      .populate({ path: "employeeId", select: "username" })
      .populate("printerId", "name")
      .sort({ date: -1 });

    const employees = await User.find().select("username");

    res.render("waste/wasteReports", {
      reports,
      employees,
      filters: req.query,
      username: req.user ? req.user.username : "Admin",
      currentPage: "waste",
      moment,
    });
  } catch (err) {
    console.error("Error Fetching Waste:", err);
    res.status(500).send("Error fetching waste reports");
  }
};

module.exports = {
  createWasteReport,
  createWasteReportWithAI,
  admin_waste_get,
};
