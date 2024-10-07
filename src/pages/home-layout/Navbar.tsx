import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";
import AppLogoUrl from "@/assets/AppLogo.svg?url";
import routes from "@/router/routes";

/**
 * navbar component
 *
 */
const Navbar = () => {
  return (
    <Grid container className="navbar">
      <Grid size={1} className="navbar-spacer-left"></Grid>
      <Grid size={10} className="navbar-content">
        <Box className="navbar-inner">
          <Grid container>
            <Grid className="navbar-logo-container">
              <img className="navbar-logo" src={AppLogoUrl} alt="AppLogo" />
            </Grid>
            <Grid className="navbar-links-container">
              <Box className="navbar-links">
                <Link className="navbar-link" to={routes.home()}>
                  Home
                </Link>
                <Link className="navbar-link" to={routes.feature()}>
                  Features
                </Link>
                <Link className="navbar-link" to={routes.pricing()}>
                  Pricing
                </Link>
                <Link className="navbar-link" to={routes.demo()}>
                  Demo{" "}
                </Link>
                <Link className="navbar-link" to={routes.contact()}>
                  Contact us
                </Link>
              </Box>
              <div className="navbar-divider" />
              <Link className="navbar-auth-link" to={routes.login()}>
                Login
              </Link>
              <Link className="navbar-auth-link" to={routes.register()}>
                Signup
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1} className="navbar-spacer-right"></Grid>
    </Grid>
  );
};

export default Navbar;
