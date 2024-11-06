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
      <Box className="faq-section__container">
        <FaqSection />
      </Box>
    </Box>  
  );
};

export default Pricing;
