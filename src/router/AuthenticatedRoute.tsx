import { Outlet, Navigate } from "react-router-dom";
import routes from "./routes";

// Higherorder component to validate the user
const AuthenticatedRoute = () => {
  const isLoggedIn = true;
  if (!isLoggedIn) {
    return <Navigate to={routes.loginOrg()} />;
  }
  return <Outlet />;
};

export default AuthenticatedRoute;
