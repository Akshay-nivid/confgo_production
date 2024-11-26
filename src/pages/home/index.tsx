import ViewPricingBanner from '../home-layout/ViewPricingBanner';
import ConfrenceManagementSection from './ConfrenceManagementSection';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import WhychooseSection from '../home-layout/WhychooseSection';
import useStore from '@/Libs/store';
import { useEffect } from 'react';

/*
 * home page component
 * @returns
 */

const HomePage = () => {

  const setDataById = useStore((state: any) => state.setDataById)
  /**
   * useEffect used to set page when return from this page
   */
  useEffect(() => {
    setDataById('register', { data: 'PLAN_PAGE', step: 1 });
    setDataById("planMode", { mode: "register" });
  }, []);
  
  return (
    <>
      <HeroSection />
      <ConfrenceManagementSection />
      <FeatureSection />
      {/* <FaqSection /> */}
      <WhychooseSection />
      <ViewPricingBanner />
    </>
  );
};

export default HomePage;
