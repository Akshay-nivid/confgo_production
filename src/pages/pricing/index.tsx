import { PlanSection } from './PlanSection';
import WhychooseSection from '../home-layout/WhychooseSection';
import FaqSection from '../home/FaqSection';
import PlanFeatureSection from './PlanFeatureSection';
import Box from '@mui/material/Box';

/**
 * pricing page component
 * @returns
 */

const Pricing = () => {
  return (
    <Box className="pricing-main">
      <PlanSection />
      <PlanFeatureSection/>
      <WhychooseSection/>
      <FaqSection />
    </Box>  
  );
};

export default Pricing;
