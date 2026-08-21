import { Navigate, Outlet } from "react-router-dom";

// שומר על ראוטים שדורשים התחברות - רק אם יש טוקן שמור ב-localStorage
// ממשיכים לדף המבוקש (Outlet), אחרת מפנים ל-login
function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
