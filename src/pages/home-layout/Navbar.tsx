import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import AppLogoUrl from '@/assets/AppLogo.svg?url';
import routes from '@/router/routes';

/**
 * navbar component
 *
 */
const Navbar = () => {
  return (
    <Grid container className="nav">
      <Grid size={1} className="nav-spacer-left"></Grid>
      <Grid size={10} className="nav-content">
        <Box className="nav-inner">
          <Grid container>
            <Grid className="nav-logo-container">
              <img className="nav-logo" src={AppLogoUrl} alt="AppLogo" />
            </Grid>
            <Grid className="nav-links-container">
              <Box className="nav-links">
                <Link className="nav-link" to={routes.home()}>
                  Home
                </Link>
                <Link className="nav-link" to={routes.feature()}>
                  Features
                </Link>
                <Link className="nav-link" to={routes.pricing()}>
                  Pricing
                </Link>
                <Link className="nav-link" to={routes.demo()}>
                  Demo{' '}
                </Link>
                <Link className="nav-link" to={routes.contact()}>
                  Contact us
                </Link>
              </Box>
              <div className="nav-divider" />
              <Link className="nav-auth-link" to={routes.login()}>
                Login
              </Link>
              <Link className="nav-auth-link" to={routes.register()}>
                Signup
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1} className="nav-spacer-right"></Grid>
    </Grid>
  );
};

export default Navbar;
