import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "الموظف";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "active bg-primary text-white" : "text-dark";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 sticky-top" dir="rtl">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/attendance">
          <i className="bi bi-printer-fill me-2"></i> SmartPrint
        </Link>

        <div className="d-flex gap-2 shadow-sm p-1 rounded-pill bg-light">
          <Link className={`btn btn-sm rounded-pill px-3 ${isActive("/attendance")}`} to="/attendance">
            الحضور
          </Link>
          <Link className={`btn btn-sm rounded-pill px-3 ${isActive("/print")}`} to="/print">
            طباعة
          </Link>
          <Link className={`btn btn-sm rounded-pill px-3 ${isActive("/waste")}`} to="/waste">
            هالك
          </Link>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* رابط الملف الشخصي الجديد */}
          <Link 
            to="/profile" 
            className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${
              location.pathname === "/profile" ? "btn-primary text-white" : "btn-outline-secondary"
            }`}
          >
            <i className="bi bi-person-circle"></i>
            <span className="d-none d-sm-inline">{username}</span>
          </Link>

          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-circle">
            <i className="bi bi-box-arrow-left"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;