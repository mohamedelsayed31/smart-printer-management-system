import React, { useState, useEffect } from "react";
import API from "../services/api";

const PrintJob = () => {
  const [printers, setPrinters] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    printerId: "",
    itemUsedId: "", // الـ ID بتاع الورق من المخزن
    pagesCount: 1, // عدد الصفحات (لعداد الماكينة)
    sheetsUsed: 1, // عدد الورق الفعلي (للمخزن)
    paperType: "A4", // النوع (للتصنيف)
    unitPrice: 0, // يتم تحديثه من سعر الصنف في المخزن
    customerName: "Guest",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [printersRes, inventoryRes] = await Promise.all([
          API.get("/dashboard/printers/api/all"),
          API.get("/dashboard/inventory/api/all"),
        ]);
        setPrinters(printersRes.data);
        setInventory(inventoryRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/dashboard/jobs/api/add", formData);
      alert("تم تسجيل العملية وتحديث المخزن بنجاح ✅");
      // تصفير الخانات مع الحفاظ على النوع والطابعة لتسريع الشغل
      setFormData({ ...formData, pagesCount: 1, sheetsUsed: 1 });
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في تسجيل العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5" dir="rtl">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0 text-center">تسجيل طلب طباعة</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">الطابعة المستخدمة</label>
              <select
                className="form-select"
                required
                onChange={(e) =>
                  setFormData({ ...formData, printerId: e.target.value })
                }
              >
                <option value="">-- اختر الطابعة --</option>
                {printers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (عداد: {p.counter})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">نوع الورق من المخزن</label>
              <select
                className="form-select"
                required
                onChange={(e) => {
                  const item = inventory.find((i) => i._id === e.target.value);
                  setFormData({
                    ...formData,
                    itemUsedId: e.target.value,
                    paperType: item?.itemName || "",
                    unitPrice: Number(item?.sellingPrice || 0),
                  });
                }}
              >
                <option value="">-- اختر الورق --</option>
                {inventory.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.itemName} - (المتاح: {item.quantity}) - {item.sellingPrice} EGP
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label fw-bold">عدد صفحات الملف</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={formData.pagesCount}
                  onChange={(e) =>
                    setFormData({ ...formData, pagesCount: e.target.value })
                  }
                />
                <small className="text-muted">لزيادة عداد الماكينة</small>
              </div>
              <div className="col-6 mb-3">
                <label className="form-label fw-bold">عدد الورق الفعلي</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={formData.sheetsUsed}
                  onChange={(e) =>
                    setFormData({ ...formData, sheetsUsed: e.target.value })
                  }
                />
                <small className="text-muted">للخصم من المخزن</small>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">اسم العميل (اختياري)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Guest"
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>

            <div className="alert alert-success d-flex justify-content-between align-items-center py-2">
              <span className="fw-bold">إجمالي الحساب:</span>
              <h4 className="mb-0">
                {(Number(formData.sheetsUsed) * Number(formData.unitPrice)).toFixed(2)} EGP
              </h4>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-bold shadow"
            >
              {loading ? "جاري التسجيل..." : "تأكيد العملية"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrintJob;
