import ViewPricingBanner from '../Home-Layout/ViewPricingBanner';
import ConfrenceManagementSection from './ConfrenceManagementSection';
import FaqSection from './FaqSection';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import WhychooseSection from './WhychooseSection';

/*
 * home page component
 * @returns
 */

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <ConfrenceManagementSection />
      <FeatureSection />
      <FaqSection />
      <WhychooseSection />
      <ViewPricingBanner />
    </>
  );
};

export default HomePage;
