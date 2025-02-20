import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet, useLocation } from 'react-router-dom';
import { PaymentAlertBanner } from './PaymentAlertBanner';
import useStore, { POST } from "@/Libs/store";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box/Box';
import { PayPalAlertBanner } from './PaypalClientIdBanner';

/**
 * component used to render layout
 * @returns JSX.Element
 */
const Layout = () => {
  const location = useLocation();
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [showPaypalBanner,setPayPalBanner]=useState(false);
  const showPayPalConfigAlert = useStore((state: any) => state?.compData?.showPaypalConfigAlert?.data);
  const dataInfo = useStore((state: any) => state?.compData?.["paymentBanner"]?.['subscription/verify']?.data) ?? [];
  const fullEventList = useStore((state: any) => state?.compData?.["fullEventList"]?.['event/list'].data) ?? [];
  useEffect(() => {
    const showBanner =
      dataInfo?.subscriptionStatus === false &&
      !/^\/planUpgrade(\/.*)?$/.test(location.pathname);
    setShowAlertBanner(showBanner);
    const showPaypalBanner = fullEventList?.[0]?.company?.companyPaypalConfigurations?.length === 0 ? true : false;
    setPayPalBanner(showPaypalBanner);
    if(showPayPalConfigAlert){
      setPayPalBanner(false)
    }
  }, [dataInfo, location,fullEventList,showPayPalConfigAlert]);

  useEffect(() => {
    POST({
      url: 'subscription/verify',
      body: {},
      id: 'paymentBanner'
    });
  }, []);

  return (
    <>
      <MobileLayout showAlertBanner={showAlertBanner} showPaypalBanner={showPaypalBanner} />
      <DesktopLayout showAlertBanner={showAlertBanner} showPaypalBanner={showPaypalBanner} />
    </>
  );
};

/**
 * Mobile layout for screens with xs to md width
 */



const MobileLayout = ({ showAlertBanner,showPaypalBanner }: { showAlertBanner: boolean ,showPaypalBanner:boolean}) => {

  return (
    <Box width={"100%"} display={{ xs: 'block', md: 'none' }}>
      <Box className="h-screen overflow-hidden flex flex-col">
        <LayoutAppbar />
        <Box className=" h-full flex overflow-x-hidden">
           <Box maxWidth={"6rem"} className="">
            <Sidebar open={true} />
          </Box>
          <Box className="flex-1 h-full overflow-y-auto layout-content">
            <Grid container paddingInline={{
              xs: 2, sm: 0
            }} rowSpacing={2} size={{ xs: 12, md: 12 }}>
              {showAlertBanner && <Grid><PaymentAlertBanner /></Grid>}
              {showPaypalBanner && <PayPalAlertBanner />}
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
const DesktopLayout = ({ showAlertBanner,showPaypalBanner }: { showAlertBanner: boolean,showPaypalBanner:boolean }) => {
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
          <Grid display={"flex"} className="alert-box">
            {showAlertBanner && (
              <Grid  flex={1}>
                <PaymentAlertBanner />
              </Grid>
            )}
            {showPaypalBanner && (
              <Grid flex={1}>
                <PayPalAlertBanner />
              </Grid>
            )}
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
