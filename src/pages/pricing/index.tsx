import { PlanSection } from './PlanSection';
import WhychooseSection from '../Home-Layout/WhychooseSection';
import FaqSection from '../Home/FaqSection';
import PlanFeatureSection from './PlanFeatureSection';
import Grid from '@mui/material/Grid2';
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
