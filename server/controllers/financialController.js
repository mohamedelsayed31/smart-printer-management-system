const PrintJob = require("../models/PrintJob"); 
const Waste = require("../models/Waste");
const moment = require("moment");

const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filterQuery = {};

    if (startDate && endDate) {
      filterQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59')
      };
    }

    // 1. جلب عمليات الطباعة
    const printJobs = await PrintJob.find(filterQuery);

    // 2. حسابات الإيرادات والتكاليف
    let totalRevenue = 0;
    let totalCost = 0;
    
    printJobs.forEach(job => {
      // ركز هنا: استخدمنا totalPrice لأنه هو اللي فيه (العدد × سعر البيع)
      totalRevenue += job.totalPrice || 0; 
      // التكلفة اللي إنت حاسبها ومخزنها وقت الطباعة
      totalCost += job.costPrice || 0; 
    });

    const netProfit = totalRevenue - totalCost;

    // 3. التقرير اليومي (Aggregate)
    const dailyStats = await PrintJob.aggregate([
      { $match: filterQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyRevenue: { $sum: "$totalPrice" }, // عدلت دي لـ totalPrice
          dailyProfit: { $sum: { $subtract: ["$totalPrice", "$costPrice"] } }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    // عرض الصفحة
    res.render("financial/report", {
      totalRevenue,
      totalCost,
      netProfit,
      dailyStats,
      filters: req.query,
      moment,
      username: req.user.username,
      currentPage: "financial" // تأكد إن ده هو الاسم في الـ Sidebar عشان يفضل منور
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating financial report");
  }
};

module.exports = { getFinancialReport };