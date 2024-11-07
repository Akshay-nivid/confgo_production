import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import React from 'react';


/**
 * component used to render dashboard layout
 * @author Neethu
 */
const UserDashboardLayout: React.FC = React.memo(() => {

  return (
    <Box className="layout-container">
      <LayoutAppbar />
      <Box className="layout-container-grid-wrapper">
        <Grid container className="layout-container-grid">
          <Grid size={2}>
            <Sidebar open={true} />
          </Grid>
          <Grid size={10} className="layout-container-grid-outlet-grid">
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
