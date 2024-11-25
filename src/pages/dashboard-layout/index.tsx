import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { PaymentAlertBanner } from './PaymentAlertBanner';
import useStore, { POST } from "@/Libs/store";
import { useEffect } from "react";

/**
 * component used to render layout
 * @returns
 */
const Layout = () => {

  const dataInfo = useStore((state: any) => state?.compData?.["paymentBanner"]?.['subscription/verify']?.data) ?? [];

  useEffect(() => {
    POST({
      url: 'subscription/verify',
      body: {},
      id: 'paymentBanner'
    })
  }, [])

  return (
    <Box className="layout-container">
      <LayoutAppbar />
      <Box className="layout-container-grid-wrapper">
        <Grid container className="layout-container-grid">
          <Grid size={2}>
            <Sidebar open={true} />
          </Grid>
          <Grid size={10} className="layout-container-grid-outlet-grid">
            {dataInfo?.subscriptionStatus === false && <Grid><PaymentAlertBanner /></Grid>}
            <Box className="layout-container-grid-outlet-grid-outlet-adminwrapper">
              <Outlet />
            </Box>
            {/*    Commented for now          */}
            {/* <Box className="min-h-20 w-full bg-slate-100 flex justify-center items-center">
              Footer
              <Button
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  window.location.reload();
                }}
              >
                logout
              </Button>
            </Box> */}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Layout;
