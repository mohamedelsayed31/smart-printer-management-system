import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-primary fw-bold" : "text-white-50";

  return (
    <nav className="navbar fixed-bottom navbar-dark bg-dark border-top py-2" dir="rtl">
      <div className="container-fluid d-flex justify-content-around">
        <Link to="/attendance" className={`text-center text-decoration-none ${isActive("/attendance")}`}>
          <i className="bi bi-clock d-block fs-5"></i>
          <small style={{ fontSize: "11px" }}>الحضور</small>
        </Link>
        <Link to="/print" className={`text-center text-decoration-none ${isActive("/print")}`}>
          <i className="bi bi-printer d-block fs-5"></i>
          <small style={{ fontSize: "11px" }}>طباعة</small>
        </Link>
        <Link to="/waste" className={`text-center text-decoration-none ${isActive("/waste")}`}>
          <i className="bi bi-trash d-block fs-5"></i>
          <small style={{ fontSize: "11px" }}>إتلاف</small>
        </Link>
        {/* رابط بروفايل في الموبايل */}
        <Link to="/profile" className={`text-center text-decoration-none ${isActive("/profile")}`}>
          <i className="bi bi-person d-block fs-5"></i>
          <small style={{ fontSize: "11px" }}>حسابي</small>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;