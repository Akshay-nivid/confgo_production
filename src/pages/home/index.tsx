import ViewPricingBanner from '../home-layout/ViewPricingBanner';
import ConfrenceManagementSection from './ConfrenceManagementSection';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import WhychooseSection from '../home-layout/WhychooseSection';
import useStore, { IStoreState } from '@/Libs/store';
import { useEffect } from 'react';
import { resetStore } from '@/Libs/store';
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
      <HeroSection />
      <ConfrenceManagementSection />
      <FeatureSection />
      <WhychooseSection />
      <ViewPricingBanner />
    </>
  );
};

export default HomePage;
