import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") === "true";
  const userRole = sessionStorage.getItem("userLoggedInType");

  // Redirect to appropriate dashboard if the user is logged in
  if (isUserLoggedIn) {
    const dashboardRoute = userRole === "COMPANY" ? "/dashboard" : "/user/dashboard";
    return <Navigate to={dashboardRoute} replace />;
  }

  // Render public content
  return children;
};

export default PublicRoute;
