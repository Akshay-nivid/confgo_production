import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoutes: React.FC<PrivateRouteProps & { role: "COMPANYADMIN" | "USER" | "REVIEWER" | "SPEAKER" }> = ({ children, role }) => {
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") === "true";
  const userRole = sessionStorage.getItem("userLoggedInType");
  const token = sessionStorage.getItem("token");
  // Wait until the states are checked
  if ((isUserLoggedIn === null || userRole === null) && token != null) {
    return <div>Loading...</div>;
  }

  // Redirect to login if user is not loCOMPANYADMINgged in or has incorrect role
  if (!isUserLoggedIn || userRole !== role) {
    const loginRoute = role === "COMPANYADMIN" ? "/organization/login" : "/user/login";
    return <Navigate to={loginRoute} replace />;
  }

  // Render protected content
  return children;
};

export const PrivateRouteCompany: React.FC<PrivateRouteProps> = ({ children }) => (
  <PrivateRoutes role="COMPANYADMIN">{children}</PrivateRoutes>
);

export const PrivateRouteUser: React.FC<PrivateRouteProps> = ({ children }) => (
  <PrivateRoutes role="USER">{children}</PrivateRoutes>
);

export const PrivateRouteReviewer: React.FC<PrivateRouteProps> = ({ children }) => (
  <PrivateRoutes role="REVIEWER">{children}</PrivateRoutes>
);

export const PrivateRouteSpeaker: React.FC<PrivateRouteProps> = ({ children }) => (
  <PrivateRoutes role="SPEAKER">{children}</PrivateRoutes>
);

export default { PrivateRouteCompany, PrivateRouteUser, PrivateRouteReviewer, PrivateRouteSpeaker };
