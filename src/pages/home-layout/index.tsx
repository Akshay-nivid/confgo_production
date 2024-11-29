import { useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useIsMobileScreen } from '@/Utils/CommonBaseClass';
import MobileNavbar from './MobileNavbar';

/**
 * home layout component
 *
 */
const HomeLayout = () => {
  const isMobile= useIsMobileScreen();
  /**
   * scroll to top of the window on initial loading of the page
   */
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, [location.pathname]);

  return (
    <>
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <Box paddingTop={'5.5rem'}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

export default HomeLayout;
