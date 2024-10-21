import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link, useLocation } from 'react-router-dom';
import routes from '@/router/routes';
import { AppLogoWhite, AppThemeLogo, Divider } from '@/assets/svg';
import { useMemo } from 'react';

/**
 * Component used to draw nav bar
 */
const Navbar = () => {
  const location = useLocation(); // Get the current path

  /**
   * useMemo used to provide color to nav based on path
   */
  // navbar theme based on path
  const getLinkClassName = useMemo(() => {
    return (path: string) => `nav-link ${location.pathname === path ? 'active' : ''}`;
  }, [location.pathname]);

  const theme = useMemo(() => {
    
    const themeMapper: any = {
      '/': { bgcolor: 'nav-theme-black-background', color: 'nav-theme-white' }
    };
    const defaultTheme: any = { bgcolor: 'nav-theme-white-background', color: 'nav-theme-black' };
    return themeMapper[location.pathname] || defaultTheme
  }, [location.pathname])

  return (
    <Grid container className={`nav ${theme.bgcolor}`}>
      <Grid size={1} className="nav-spacer-left"></Grid>
      <Grid size={10} className="nav-content">
        <Box className="nav-inner">
          <Grid container>
            <Grid className="nav-logo-container">
              {location.pathname === '/' ? <AppLogoWhite className={`nav-logo-container-icon ${theme.color}`} /> : <AppThemeLogo className={`nav-logo-container-icon`} />}
            </Grid>
            <Grid className="nav-links-container">
              <Box className={`nav-links ${theme.color}`}>
              <Link className={getLinkClassName(routes.home())} to={routes.home()}>
        Home
      </Link>
      <Link className={getLinkClassName(routes.feature())} to={routes.feature()}>
        Features
      </Link>
      <Link className={getLinkClassName(routes.pricing())} to={routes.pricing()}>
        Pricing
      </Link>
      <Link className={getLinkClassName(routes.demo())} to={routes.demo()}>
        Demo
      </Link>
      <Link className={getLinkClassName(routes.contact())} to={routes.contact()}>
        Contact us
      </Link>
      <Divider className={`nav-divider ${theme.color}`} />
      <Link className={getLinkClassName(routes.login())} to={routes.login()}>
        Login
      </Link>
      <Link className={getLinkClassName(routes.register())} to={routes.register()}>
        Signup
      </Link>
              </Box>

            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1} className="nav-spacer-right"></Grid>
    </Grid>
  );
};

export default Navbar;
