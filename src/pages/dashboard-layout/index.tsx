import Sidebar from './Sidebar';
import LayoutAppbar from './LayoutAppbar';
import Grid from '@mui/material/Grid2';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { PaymentAlertBanner } from './PaymentAlertBanner';
import useStore, { POST } from "@/Libs/store";
import { useEffect, useState } from "react";

/**
 * component used to render layout
 * @returns
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
    })
  }, [])

  return (

    <Grid className="layout-container" container width={'100%'}>

      <Grid minWidth={'5.88rem'} size={{xs:0,md:2}}>
        <Sidebar open={true} />
      </Grid>

      <Grid className="h-full  " flex={{xs:1}} size={{md:10}} display={'flex'} flexDirection={'column'}>

        <Grid size={12}>
          <LayoutAppbar />
        </Grid>

        <Grid size={{ xs: 12, md: 12 }} className="">
          {showAlertBanner && <Grid><PaymentAlertBanner /></Grid>}
        </Grid>

        <div className="flex-1 overflow-y-auto h-full layout-content" >
          <Outlet />
        </div>

      </Grid>

    </Grid>
  );
};

export default Layout;
