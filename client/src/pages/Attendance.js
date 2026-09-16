import React, { useState, useEffect } from "react";
import API from "../services/api";
import moment from "moment";

const Attendance = () => {
  const [status, setStatus] = useState("loading"); // loading, out, in, completed
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
    }, 1000);
    checkCurrentStatus();
    return () => clearInterval(timer);
  }, []);

  const checkCurrentStatus = async () => {
    try {
      const res = await API.get("/dashboard/attendance/status");
      if (res.data.isCompletedToday) {
        setStatus("completed");
      } else if (res.data.isPresent) {
        setStatus("in");
      } else {
        setStatus("out");
      }
    } catch (err) {
      setStatus("out");
    }
  };

  // 🔥 دالة سحرية جديدة لجلب إحداثيات الموقع الجغرافي من المتصفح مجاناً
  const getLocationCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("متصفحك لا يدعم خاصية تحديد الموقع الجغرافي.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(
              "يرجى السماح للمتصفح بالوصول إلى موقعك (GPS) لتتمكن من تسجيل الحضور/الانصراف."
            );
          }
        );
      }
    });
  };

  const handleAction = async (actionType) => {
    try {
      // 1. اطلب الموقع الجغرافي للموظف أولاً وانتظر موافقته
      const coordinates = await getLocationCoordinates();

      // 2. تحديد الـ endpoint المناسب
      const endpoint =
        actionType === "in"
          ? "/dashboard/attendance/check-in"
          : "/dashboard/attendance/check-out";

      // 3. إرسال الداتا للباك إند متضمنة الإحداثيات (lat, lng) 👇
      const res = await API.post(endpoint, {
        lat: coordinates.lat,
        lng: coordinates.lng,
      });

      alert(res.data.message || "تم التسجيل بنجاح");

      if (actionType === "out") {
        setStatus("completed");
      } else {
        checkCurrentStatus();
      }
    } catch (err) {
      // لو اليوزر رفض إذن الموقع أو حصل خطأ من السيرفر
      if (typeof err === "string") {
        alert(err); // هيطبع رسالة رفض الصلاحية للموقع
      } else {
        alert(
          err.response?.data?.message || "حدث خطأ ما أثناء الاتصال بالسيرفر"
        );
      }
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-lg p-4 border-0">
        <h2 className="mb-4">سجل الحضور الذكي</h2>
        <div className="display-4 fw-bold text-primary mb-2">{currentTime}</div>
        <p className="text-muted mb-5">
          {moment().format("dddd, MMMM Do YYYY")}
        </p>

        {status === "loading" ? (
          <div className="spinner-border text-primary" role="status"></div>
        ) : status === "out" ? (
          <button
            onClick={() => handleAction("in")}
            className="btn btn-success btn-lg px-5 py-3 shadow-sm"
          >
            <i className="bi bi-geo-alt-fill me-2"></i> تسجيل حضور (Check In)
          </button>
        ) : status === "in" ? (
          <button
            onClick={() => handleAction("out")}
            className="btn btn-danger btn-lg px-5 py-3 shadow-sm"
          >
            <i className="bi bi-door-open-fill me-2"></i> تسجيل انصراف (Check
            Out)
          </button>
        ) : (
          <div className="alert alert-info py-4" role="alert">
            <i className="bi bi-check-circle-fill fs-1 text-success d-block mb-3"></i>
            <h4 className="alert-heading">تم انتهاء عملك اليوم!</h4>
            <p className="mb-0 text-muted">
              لقد قمت بتسجيل الحضور والانصراف لهذا اليوم. شكرًا لمجهودك.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
