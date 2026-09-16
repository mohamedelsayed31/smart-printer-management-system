import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import PrintJob from "./pages/PrintJob";
import WasteReport from "./pages/WasteReport";
import Profile from "./pages/Profile"; // 1. استيراد صفحة البروفايل الجديدة
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav"; // 2. استيراد شريط التنقل السفلي للموبايل
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// مكون لحماية المسارات (لو مش مسجل دخول يرجعه للوجين)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول بدون شريط تنقل */}
        <Route path="/" element={<Login />} />

        {/* صفحة الحضور والغياب */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Navbar />
              <Attendance />
              <BottomNav />
            </ProtectedRoute>
          }
        />

        {/* صفحة تسجيل طلبات الطباعة */}
        <Route
          path="/print"
          element={
            <ProtectedRoute>
              <Navbar />
              <PrintJob />
              <BottomNav />
            </ProtectedRoute>
          }
        />

        {/* صفحة تسجيل الهالك */}
        <Route
          path="/waste"
          element={
            <ProtectedRoute>
              <Navbar />
              <WasteReport />
              <BottomNav />
            </ProtectedRoute>
          }
        />

        {/*  مسار صفحة الـ Profile  */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
              <BottomNav />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;