import { useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

/**
 * home layout component
 *
 */
const HomeLayout = () => {
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
      <Navbar />
      <Box paddingTop={'5.5rem'}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

export default HomeLayout;
