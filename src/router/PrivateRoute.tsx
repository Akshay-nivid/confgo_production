import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoutes: React.FC<PrivateRouteProps & { role: "COMPANY" | "USER" }> = ({ children, role }) => {
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") === "true";
  const userRole = sessionStorage.getItem("userLoggedInType");
  const token=sessionStorage.getItem("token");
  // Wait until the states are checked
  if ((isUserLoggedIn === null || userRole === null) && token!=null) {
    return <div>Loading...</div>;
  }

  // Redirect to login if user is not logged in or has incorrect role
  if (!isUserLoggedIn || userRole !== role) {
    const loginRoute = role === "COMPANY" ? "/organization/login" : "/user/login";
    return <Navigate to={loginRoute} replace />;
  }

  // Render protected content
  return children;
};

export const PrivateRouteCompany: React.FC<PrivateRouteProps> = ({ children }) => (
  <PrivateRoutes role="COMPANY">{children}</PrivateRoutes>
);

export const PrivateRouteUser: React.FC<PrivateRouteProps> = ({ children }) => (
  <PrivateRoutes role="USER">{children}</PrivateRoutes>
);

export default { PrivateRouteCompany, PrivateRouteUser };
