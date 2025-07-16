import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const location = useLocation();

  const publicRoutes = ["/home" ,"/login", "/signup", "/forgetpassword"];

  // If user is already logged in and tries to access a public route, redirect them
  if (token && user && publicRoutes.includes(location.pathname)) {
    if (user.role === "admin") {
      return <Navigate to="/adminDashboard" replace />;
    } else if (user.role === "user") {
      return <Navigate to="/home" replace />;
    } 
  }

  // If user is NOT logged in and trying to access a protected route
  if (!token || !user) {
    if (!publicRoutes.includes(location.pathname)) {
      return <Navigate to="/login" replace />;
    } else {
      return element; // allow public route access
    }
  }

  // If user is logged in but role doesn't match allowed route
  if (allowedRole && user.role !== allowedRole) {
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        403 - Forbidden: You are not authorized
      </h2>
    );
  }

  // Allow access to the intended route
  return element;
};

export default ProtectedRoute;
