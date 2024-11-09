import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';


/**
 * component used to render dashboard layout
 * @author Neethu
 */
const UserDashboardLayout: React.FC = React.memo(() => {
  /**
    * Useeffect hook handles the api call 
    */
  useEffect(() => {
    console.log(sessionStorage.getItem("participantId"));


  }, [])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //hide sidebar close
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
  return (
    <Box className="layout-container">
      <LayoutAppbar />
      <Box className="layout-container-grid-wrapper">
        <Grid container className="layout-container-grid">
          <Grid size={2} className="layout-container-sidebar">
            <Sidebar open={isSidebarOpen} onClose={handleSidebarClose}/>
          </Grid>
          <Grid  size={10} border={1} className="layout-container-grid-outlet-grid">
            <Box className="layout-container-grid-outlet-grid-outlet-wrapper">
              <Outlet />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

export default UserDashboardLayout;
