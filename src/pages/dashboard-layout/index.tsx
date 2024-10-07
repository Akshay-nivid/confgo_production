import Sidebar from "./Sidebar";
import AppBar from "./AppBar";
import Grid from "@mui/material/Grid2";
import { Outlet } from "react-router-dom";
import { Box, Button } from "@mui/material";

/**
 * component used to render layout
 * @returns
 */
const Layout = () => {
  return (
    <Box className="layout-container">
      <AppBar />
      <Box className="layout-container-grid-wrapper">
        <Grid container className="layout-container-grid">
          <Grid size={2}>
            <Sidebar open={true} />
          </Grid>
          <Grid size={10} className="layout-container-grid-outlet-grid">
            <Box className="layout-container-grid-outlet-grid-outlet-wrapper">
              <Outlet />
            </Box>
            <Box className="min-h-20 w-full bg-slate-100 flex justify-center items-center">
              Footer
              <Button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  window.location.reload();
                }}
              >
                logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Layout;
