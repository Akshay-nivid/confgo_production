import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useStore from '@/Libs/store';
import { useIsMobileScreen } from '@/Utils/CommonBaseClass';

/**
 * component used to render dashboard layout
 * @author Neethu
 */
const UserDashboardLayout: React.FC = React.memo(() => {

  // Retrieve userDetails from the store
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
 
  
  //use effect
  useEffect(() => {
  }, [userDetails]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobileView = useIsMobileScreen();
  //hide sidebar close
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  return (
    <Box className="user-layout-container">
      <LayoutAppbar userDetails={userDetails}/>
      <Box className="user-layout-container-grid-wrapper">
        <Grid container size={12} className="user-layout-container-grid">
        {!isMobileView && (
  <Grid className="user-layout-container-grid-sidebar-grid">
    <Sidebar open={isSidebarOpen} onClose={handleSidebarClose} />
  </Grid>
)}
          <Grid   className="user-layout-container-grid-outlet-grid">
            <Box className="user-layout-container-grid-outlet-grid-outlet-wrapper">
              <Outlet />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

export default UserDashboardLayout;
