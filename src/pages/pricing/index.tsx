import { PlanSection } from './PlanSection';
import WhychooseSection from '../home-layout/WhychooseSection';
import PlanFeatureSection from './PlanFeatureSection';
import Grid from '@mui/material/Grid2';

/**
 * pricing page component
 * @returns
 */

const Pricing = () => {
  return (
    <Grid>
      <PlanSection />
      <PlanFeatureSection/>
      <WhychooseSection/>
    </Grid>  
  );
};

export default Pricing;
