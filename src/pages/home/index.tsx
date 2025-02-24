import useStore, { IStoreState } from '@/Libs/store';
import { useEffect } from 'react';
import { resetStore } from '@/Libs/store';
// import { Box, CircularProgress } from '@mui/material';
import ViewPricingBanner from '../home-layout/ViewPricingBanner';
import ConfrenceManagementSection from './ConfrenceManagementSection';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import WhychooseSection from '../home-layout/WhychooseSection';


// const ViewPricingBanner = lazy(() => import('../home-layout/ViewPricingBanner'));
// const ConfrenceManagementSection = lazy(() => import('./ConfrenceManagementSection'));
// const FeatureSection = lazy(() => import('./FeatureSection'));
// const HeroSection = lazy(() => import('./HeroSection'));
// const WhychooseSection = lazy(() => import('../home-layout/WhychooseSection')); 
/*
 * home page component
 * @returns
 */

const HomePage = () => {

  const setDataById = useStore((state: IStoreState) => state.setDataById)
  /**
   * useEffect used to set page when return from this page
   */
  useEffect(() => {
    sessionStorage.clear();
    resetStore();
    localStorage.clear();
    setDataById('register', { data: 'PLAN_PAGE', step: 1 });
    setDataById("planMode", { mode: "register" });
  }, []);
  
  return (
    <>
      {/* <Suspense fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      }> */}
        <HeroSection />
        <ConfrenceManagementSection />
        <FeatureSection />
        <WhychooseSection />
        <ViewPricingBanner />
      {/* </Suspense> */}
    </>
  );
};

export default HomePage;
