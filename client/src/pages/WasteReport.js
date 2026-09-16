import React, { useState, useEffect } from "react";
import API from "../services/api";

const WasteReport = () => {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // لمعاينة الصورة
  
  const [formData, setFormData] = useState({
    printerId: "",
    wastedSheets: 1,
    reason: "",
    image: null // ملف الصورة
  });

  useEffect(() => {
    API.get("/dashboard/printers/api/all")
       .then((res) => setPrinters(res.data))
       .catch(err => console.error("خطأ في جلب الطابعات", err));
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // التعامل مع اختيار الصورة من الكاميرا أو المعرض
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("رجاءً قم بتصوير أو رفع صورة الورقة التالفة أولاً 📸");
      return;
    }

    setLoading(true);

    // لأننا سنرسل ملف (صورة)، يجب استخدام FormData بدلاً من JSON العادي
    const data = new FormData();
    data.append("printerId", formData.printerId);
    data.append("wastedSheets", formData.wastedSheets);
    data.append("reason", formData.reason);
    data.append("image", formData.image); // إرسال الصورة

    try {
      // إرسال البيانات للباك إند (المسار الجديد المسئول عن تحليل الـ AI)
      const res = await API.post("/dashboard/waste/add-with-ai", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // الباك إند سيرجع لنا تقييم الـ AI لنعرضه في الـ Alert
      const labels = {
        Machine: "عطل ماكينة",
        Employee: "خطأ موظف",
        Unknown: "غير محسوم / يحتاج مراجعة يدوية",
      };
      const analysis = res.data.aiAnalysis || {};
      alert(
        `تم تسجيل الهالك بنجاح!\n` +
        `نتيجة التحليل: ${labels[analysis.decision] || labels.Unknown}\n` +
        `السبب: ${analysis.explanation || "لا يوجد تفسير"}\n` +
        `المزوّد: ${analysis.provider || "None"}`
      );

      // تصفير الفورم
      setFormData({ printerId: "", wastedSheets: 1, reason: "", image: null });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    } catch (err) {
      alert(err.response?.data?.message || "فشل في تسجيل الهالك بالـ AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" dir="rtl">
      <div className="card shadow-sm border-0 border-top border-4 border-danger">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 text-danger fw-bold">
            <i className="bi bi-cpu-fill me-2"></i>تسجيل الهالك الذكي (تحليل AI)
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            
            {/* اختيار الطابعة */}
            <div className="mb-3">
              <label className="form-label fw-bold">الطابعة التي حدث بها العطل</label>
              <select
                className="form-select"
                required
                value={formData.printerId}
                onChange={(e) => setFormData({ ...formData, printerId: e.target.value })}
              >
                <option value="">-- اختر الطابعة --</option>
                {printers.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* عدد الورق التالف */}
            <div className="mb-3">
              <label className="form-label fw-bold">عدد الورق التالف</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={formData.wastedSheets}
                onChange={(e) => setFormData({ ...formData, wastedSheets: e.target.value })}
                required
              />
            </div>

            {/* 📸 حقل تصوير الورقة (جديد) */}
            <div className="mb-3">
              <label className="form-label fw-bold">تصوير الورقة التالفة لإثبات السبب</label>
              <input
                type="file"
                accept="image/*"
                capture="environment" // يفتح الكاميرا الخلفية مباشرة على الموبايل
                className="form-control"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxHeight: "200px" }} />
                </div>
              )}
            </div>

            {/* ملاحظات الموظف */}
            <div className="mb-3">
              <label className="form-label fw-bold">وصف المشكلة من وجهة نظرك (اختياري)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="مثلاً: الورق اتحشر..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              ></textarea>
            </div>

            {/* زر الإرسال */}
            <button type="submit" disabled={loading} className="btn btn-danger w-100 py-2 fw-bold">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  جاري تحليل الورقة بالـ AI وتسجيلها...
                </>
              ) : "إرسال وتحليل الهالك"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WasteReport;