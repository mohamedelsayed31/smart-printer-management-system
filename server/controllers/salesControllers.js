const Sale = require("../models/Sale");
const PrintJob = require("../models/PrintJob");

// 1️⃣ recordSale (تسجيل عملية البيع)
const recordSale = async (req, res) => {
   try {
      const { printJobId, sellingPrice } = req.body;

      // 1. نتأكد إن البيانات مبعوتة
      if (!printJobId || !sellingPrice) {
         return res.status(400).json({
            success: false,
            message: "الرجاء إدخال رقم أمر الطباعة وسعر البيع"
         });
      }

      // 2. نجيب أمر الطباعة من الداتابيز باستخدام findById بدل findByPk
      const printJob = await PrintJob.findById(printJobId);

      // لو أمر الطباعة مش موجود، نوقف العملية ونرجع Error
      if (!printJob) {
         return res.status(404).json({
            success: false,
            message: "أمر الطباعة غير موجود"
         });
      }

      // 3. نتأكد إن أمر الطباعة ده متباعش قبل كدا (عشان منع التكرار)
      const existingSale = await Sale.findOne({ printJobId });
      if (existingSale) {
         return res.status(400).json({
            success: false,
            message: "تم تسجيل عملية بيع مسبقاً لهذا الأمر"
         });
      }

      // 4. حساب التكلفة (لو الورق مش مسجل هنعتبره 0 عشان نتجنب الـ NaN)
      // افترضنا هنا زي ما كتبت إن تكلفة الورقة الواحدة = 2
      const cost = (printJob.paperUsed || 0) * 2; 

      // 5. حساب الربح
      const profit = sellingPrice - cost;

      // 6. تسجيل عملية البيع
      const sale = await Sale.create({
         printJobId: printJob._id, // استخدمنا _id بتاع Mongoose
         sellingPrice: sellingPrice,
         cost: cost,
         // profit: profit // (ملحوظة: لو تفتكر احنا عملنا pre-save hook في الموديل بيحسبه أوتوماتيك، بس هنبعته برضه للتأكيد)
      });

      res.status(201).json({
         success: true,
         message: "Sale recorded successfully",
         data: sale
      });

   } catch (error) {
      // لو حصلت مشكلة في الداتابيز
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};

module.exports = {
   recordSale
};