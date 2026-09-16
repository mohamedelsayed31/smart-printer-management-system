import React, { useState, useEffect } from "react";
import API from "../services/api";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // محاولة جلب البيانات ديناميكياً من السيرفر
        const res = await API.get("/dashboard/profile/me");
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile data", err);
        
        // 🔥 الحل البديل (Fallback): قراءة بيانات المستخدم الحقيقية المسجلة من الـ localStorage
        setProfileData({
          user: {
            fullName: localStorage.getItem("username") || "موظف ذكي",
            email: localStorage.getItem("userEmail") || "employee@smartprint.com", // 🌟 قراءة الإيميل ديناميكياً هنا
            role: "عضو طاقم العمل",
            joinDate: new Date().toISOString() // تاريخ اليوم كافتراضي حتي يرجع من السيرفر
          },
          stats: {
            totalHoursThisMonth: 0,
            totalJobsRegistered: 0,
            totalRevenueGenerated: 0,
            totalWastedSheets: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 text-end" dir="rtl">
      {/* بطاقة معلومات الحساب */}
      <div className="card shadow-sm border-0 overflow-hidden mb-4 rounded-4">
        <div className="bg-primary p-4 text-white text-center position-relative">
          <div className="mb-2">
            <i className="bi bi-person-circle" style={{ fontSize: "4.5rem" }}></i>
          </div>
          <h3 className="fw-bold mb-1">{profileData?.user?.fullName}</h3>
          <span className="badge bg-white text-primary px-3 rounded-pill fw-bold">
            {profileData?.user?.role}
          </span>
        </div>
        <div className="card-body bg-white p-4">
          <div className="row g-3">
            <div className="col-md-6 border-start-md">
              <p className="mb-1 text-muted small">البريد الإلكتروني</p>
              <h6 className="fw-bold text-dark">{profileData?.user?.email}</h6>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted small">تاريخ الانضمام</p>
              <h6 className="fw-bold text-dark">
                {profileData?.user?.joinDate ? new Date(profileData.user.joinDate).toLocaleDateString('ar-EG') : '---'}
              </h6>
            </div>
          </div>
        </div>
      </div>

      <h5 className="fw-bold text-dark mb-3">
        <i className="bi bi-graph-up-arrow text-primary me-2"></i>إحصائيات الأداء والإنتاجية (هذا الشهر)
      </h5>

      {/* شبكة الكروت الإحصائية */}
      <div className="row g-3">
        {/* كارت ساعات العمل */}
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 border-top border-4 border-success h-100 rounded-3">
            <div className="card-body p-3 text-center">
              <i className="bi bi-clock-history text-success fs-3 d-block mb-1"></i>
              <small className="text-muted d-block mb-1">ساعات العمل</small>
              <h4 className="fw-bold text-dark mb-0">{profileData?.stats?.totalHoursThisMonth} ساعة</h4>
            </div>
          </div>
        </div>

        {/* كارت العمليات المسجلة */}
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 border-top border-4 border-info h-100 rounded-3">
            <div className="card-body p-3 text-center">
              <i className="bi bi-file-earmark-check text-info fs-3 d-block mb-1"></i>
              <small className="text-muted d-block mb-1">طلبات الطباعة</small>
              <h4 className="fw-bold text-dark mb-0">{profileData?.stats?.totalJobsRegistered} عملية</h4>
            </div>
          </div>
        </div>

        {/* كارت الدخل المالي للطلبات */}
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 border-top border-4 border-primary h-100 rounded-3">
            <div className="card-body p-3 text-center">
              <i className="bi bi-cash-coin text-primary fs-3 d-block mb-1"></i>
              <small className="text-muted d-block mb-1">إجمالي الإيراد</small>
              <h4 className="fw-bold text-dark mb-0">{profileData?.stats?.totalRevenueGenerated} EGP</h4>
            </div>
          </div>
        </div>

        {/* كارت الهالك المحسوب عليه */}
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 border-top border-4 border-danger h-100 rounded-3">
            <div className="card-body p-3 text-center">
              <i className="bi bi-exclamation-octagon text-danger fs-3 d-block mb-1"></i>
              <small className="text-muted d-block mb-1">الورق التالف</small>
              <h4 className="fw-bold text-dark mb-0">{profileData?.stats?.totalWastedSheets} ورقة</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;