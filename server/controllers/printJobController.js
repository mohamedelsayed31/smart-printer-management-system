const PrintJob = require("../models/PrintJob");
const Printer = require("../models/Printer");
const Inventory = require("../models/Inventory");

// 1. عرض كل العمليات
const job_index_get = async (req, res) => {
  try {
    const jobs = await PrintJob.find()
      .populate("printer")
      .populate("itemUsed")
      .populate("employee", "username fullName"); // جلب بيانات المستخدم
    res.render("jobs/index", {
      arr: jobs,
      username: req.user ? req.user.username : "Admin",
      currentPage: "jobs",
    });
  } catch (err) {
    res.status(500).send("Error loading jobs");
  }
};

// 2. صفحة إضافة عملية (EJS)
const job_add_get = async (req, res) => {
  try {
    const printers = await Printer.find({ status: "active" });
    const inventory = await Inventory.find({ category: "Paper" }); 
    res.render("jobs/add", {
      printers,
      inventory,
      username: req.user ? req.user.username : "Admin",
      currentPage: "jobs",
    });
  } catch (err) {
    res.status(500).send("Error loading page");
  }
};

// 3. حفظ العملية (من الفورم التقليدي EJS)
const job_create_post = async (req, res) => {
  try {
    // 1. استلام البيانات من الفورم
    const { 
      printer, 
      itemUsed, 
      pagesCount, 
      sheetsUsed, 
      paperType, 
      totalPrice, 
      customerName 
    } = req.body;

    const actualPagesCount = Number(pagesCount) || 0;
    const actualSheetsUsed = Number(sheetsUsed) || actualPagesCount || 1;

    // 2. جلب بيانات الصنف من المخزن للتحقق من الرصيد وحساب التكلفة
    const inventoryItem = await Inventory.findById(itemUsed);
    if (!inventoryItem) {
        return res.status(404).send("الصنف غير موجود في المخزن!");
    }

    // 3. التحقق من الرصيد (منع السحب بالسالب)
    if (inventoryItem.quantity < actualSheetsUsed) {
        return res.status(400).send(`عفواً، الرصيد في المخزن لا يكفي. المتاح: ${inventoryItem.quantity} ورقة فقط.`);
    }

    // 4. حساب تكلفة العملية أوتوماتيك (عدد الورق × تكلفة الورقة الواحدة)
    const jobCost = (inventoryItem.costPrice || 0) * actualSheetsUsed;

    // 5. إنشاء العملية في قاعدة البيانات
    await PrintJob.create({
      printer: printer,
      itemUsed: itemUsed,
      employee: req.user ? req.user._id : null,
      pagesCount: actualPagesCount,
      sheetsUsed: actualSheetsUsed,
      paperType: paperType || "Standard A4",
      totalPrice: (inventoryItem.sellingPrice || 0) * actualSheetsUsed,
      costPrice: jobCost,                  // التكلفة المحسوبة أوتوماتيك
      customerName: customerName || "Guest",
    });

    // 6. تحديث عداد الطابعة وخصم الكمية من المخزن بالتوازي
    await Promise.all([
      Printer.findByIdAndUpdate(printer, { 
        $inc: { counter: actualPagesCount } 
      }),
      Inventory.findByIdAndUpdate(itemUsed, { 
        $inc: { quantity: -actualSheetsUsed } 
      })
    ]);

    // 7. توجيه للوحة العمليات
    res.redirect("/dashboard/jobs");

  } catch (err) {
    console.error("خطأ أثناء تسجيل العملية:", err);
    res.status(400).send(`فشل تسجيل العملية. السبب: ${err.message}`);
  }
};

// 4. إنشاء طلب طباعة (لو شغال بـ React أو API خارجي)
const createPrintJob = async (req, res) => {
  try {
    const { 
      printerId, 
      itemUsedId, 
      pagesCount, 
      sheetsUsed, 
      paperType, 
      unitPrice, 
      totalPrice, 
      customerName 
    } = req.body;
    
    const actualPagesCount = Number(pagesCount) || 0;
    const actualSheetsUsed = Number(sheetsUsed) || actualPagesCount || 1;

    // 1. جلب بيانات الصنف
    const inventoryItem = await Inventory.findById(itemUsedId);
    if (!inventoryItem) {
        return res.status(404).json({ success: false, message: "الصنف غير موجود في المخزن!" });
    }

    // 2. التحقق من الرصيد
    if (inventoryItem.quantity < actualSheetsUsed) {
        return res.status(400).json({ 
            success: false, 
            message: `عفواً، الرصيد لا يكفي. المتاح: ${inventoryItem.quantity}` 
        });
    }

    // 3. حساب السعر والتكلفة
    const finalPrice = (inventoryItem.sellingPrice || 0) * actualSheetsUsed;
    const jobCost = (inventoryItem.costPrice || 0) * actualSheetsUsed;

    // 4. التسجيل في الداتابيز
    const newJob = await PrintJob.create({
      printer: printerId,
      itemUsed: itemUsedId,
      employee: req.user ? req.user._id : null, 
      pagesCount: actualPagesCount,
      sheetsUsed: actualSheetsUsed, 
      paperType: paperType || "Standard A4", 
      totalPrice: finalPrice || 0, // سعر البيع
      costPrice: jobCost,          // التكلفة
      customerName: customerName || "Guest",
      jobDate: new Date()
    });

    // 5. تحديث العداد والمخزن
    await Promise.all([
      Printer.findByIdAndUpdate(printerId, { $inc: { counter: actualPagesCount } }),
      Inventory.findByIdAndUpdate(itemUsedId, { $inc: { quantity: -actualSheetsUsed } })
    ]);

    res.status(201).json({ success: true, data: newJob });

  } catch (err) {
    console.error("API Error:", err); 
    res.status(500).json({ 
      success: false, 
      message: "حدث خطأ أثناء تسجيل العملية", 
      details: err.message 
    });
  }
};

module.exports = { job_index_get, job_add_get, job_create_post, createPrintJob };