import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet, useLocation } from 'react-router-dom';
import { PaymentAlertBanner } from './PaymentAlertBanner';
import useStore, { POST } from "@/Libs/store";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box/Box';

/**
 * component used to render layout
 * @returns JSX.Element
 */
const Layout = () => {
  const location = useLocation();
  const [showAlertBanner, setShowAlertBanner] = useState(false);

  const dataInfo = useStore((state: any) => state?.compData?.["paymentBanner"]?.['subscription/verify']?.data) ?? [];

  useEffect(() => {
    const showBanner =
      dataInfo?.subscriptionStatus === false &&
      !/^\/planUpgrade(\/.*)?$/.test(location.pathname);
    setShowAlertBanner(showBanner);
  }, [dataInfo, location]);

  useEffect(() => {
    POST({
      url: 'subscription/verify',
      body: {},
      id: 'paymentBanner'
    });
  }, []);

  return (
    <>
      <MobileLayout showAlertBanner={showAlertBanner} />
      <DesktopLayout showAlertBanner={showAlertBanner} />
    </>
  );
};

/**
 * Mobile layout for screens with xs to md width
 */



const MobileLayout = ({ showAlertBanner }: { showAlertBanner: boolean }) => {

  return (
    <Box width={"100%"} display={{ xs: 'block', md: 'none' }}>
      <Box className="h-screen overflow-hidden flex flex-col">
        <LayoutAppbar />
        <Box className=" h-full flex overflow-x-hidden">
           <Box maxWidth={"6rem"} className="">
            <Sidebar open={true} />
          </Box>
          <Box className="flex-1 h-full overflow-y-auto layout-content">
          <Grid size={{ xs: 12, md: 12 }}>
            {showAlertBanner && <Grid><PaymentAlertBanner /></Grid>}
            </Grid>
            <Box className="flex-1">
            <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Desktop layout for screens with md and above width
 */
const DesktopLayout = ({ showAlertBanner }: { showAlertBanner: boolean }) => {
  return (
    <Box display={{ xs: 'none', md: 'block' }}>
      <Grid className="layout-container" container width={'100%'}>
        <Grid minWidth={'5.88rem'} size={{ xs: 0, md: 2 }}>
          <Sidebar open={true} />
        </Grid>
        <Grid className="h-full" flex={{ xs: 1 }} size={{ md: 10 }} display={'flex'} flexDirection={'column'}>
          <Grid size={12}>
            <LayoutAppbar />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            {showAlertBanner && <Grid><PaymentAlertBanner /></Grid>}
          </Grid>
          <div className="flex-1 overflow-y-auto h-full layout-content">
            <Outlet />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
