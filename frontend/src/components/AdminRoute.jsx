// src/components/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useContext(AuthContext) || {};
  const location = useLocation();

  // fallback if context not ready
  const roleFromStorage = localStorage.getItem("role");
  const effectiveRole = role || roleFromStorage;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (effectiveRole !== "admin") {
    // optionally send non-admins to their dashboard:
    const roleMap = {
      admin: "/chairman-dashboard",
      teacher: "/teacher-dash",
      student: "/student-dash",
    };
    return <Navigate to={roleMap[effectiveRole] || "/student-dash"} replace />;
  }

  return children;
};

export default AdminRoute;
