import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { ServiceCard } from '../home-layout/ServiceCard';

/**
 * why choose ui section component for home page
 *
 */
const WhychooseSection = () => {
  return (
    <Grid container className="whychoose-section">
      <Grid size={1} className="whychoose-section__spacer"></Grid>
      <Grid container size={10} className="whychoose-section__content">
        <Grid size={12} className="whychoose-section__header">
          <Typography
            className="whychoose-section__header-title text-h5 font-700"
            textAlign={'center'}
          >
            Why Choose Confgo?
          </Typography>
          <Typography
            className="whychoose-section__header-description text-p1"
            textAlign={'center'}
          >
            Discover the tools that enhance your meetings and elevate your
            events.
          </Typography>
        </Grid>
        <Grid size={12} container columnSpacing={5}>
          {Array(4)
            .fill(null)
            .map(() => (
              <Grid size={3}>
                <ServiceCard />
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid size={1} className="whychoose-section__spacer"></Grid>
    </Grid>
  );
};

export default WhychooseSection;
