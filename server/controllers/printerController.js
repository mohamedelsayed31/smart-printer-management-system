const Printer = require("../models/Printer");

// 1️⃣ عرض كل الطابعات
const printer_index_get = async (req, res) => {
  try {
    const printers = await Printer.find();
    // تأكد أن المسار "printer/printers" لو وضعت الملفات داخل فولدر اسمه printer
    res.render("printer/printers", {
      arr: printers,
      username: req.user ? req.user.username : "Admin", // تأمين لو الـ user مش موجود
      currentPage: "printers",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading printers");
  }
};

// 2️⃣ صفحة إضافة طابعة (الـ Form)
const printer_add_get = (req, res) => {
  res.render("printer/addPrinter", {
    username: req.user ? req.user.username : "Admin",
    currentPage: "printers",
  });
};

// 3️⃣ حفظ الطابعة الجديدة في الداتابيز
const printer_create_post = async (req, res) => {
  try {
    // استقبال البيانات من الفورم وحفظها
    await Printer.create(req.body);

    // ✅ التعديل المهم: التوجيه للمسار الجديد اللي حددناه في الـ index.js
    res.redirect("/dashboard/printers");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error creating printer: " + err.message);
  }
};

// 1. صفحة تعديل الطابعة
const printer_edit_get = async (req, res) => {
  try {
    const printer = await Printer.findById(req.params.id);
    res.render("printer/edit", {
      obj: printer,
      username: req.user.username,
      currentPage: "printers",
    });
  } catch (err) {
    res.status(500).send("Error loading printer data");
  }
};

// 2. تنفيذ التعديل
const printer_update_post = async (req, res) => {
  try {
    await Printer.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/dashboard/printers");
  } catch (err) {
    res.status(400).send("Error updating printer");
  }
};

// 3. حذف الطابعة
const printer_delete_post = async (req, res) => {
  try {
    await Printer.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/printers");
  } catch (err) {
    res.status(500).send("Error deleting printer");
  }
};

module.exports = {
  printer_index_get,
  printer_add_get,
  printer_create_post,
  printer_edit_get,
  printer_update_post,
  printer_delete_post,
};
