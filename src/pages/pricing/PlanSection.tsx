import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import { PlanCard } from './PlanCard';
import Typography from '@mui/material/Typography/Typography';

/**
 * Plan Section ui component
 * @returns
 */
export const PlanSection = () => {
  return (
    <Grid container className="plansection__container">
      <Grid size={1}></Grid>
      <Grid container size={10} className="plansection__header">
        <Grid size={12}>
          <Typography className="plansection__title text-h1 font-700">
            Simple Pricing For Everyone
          </Typography>
          <Typography className="plansection__subtitle text-h6">
            Everything you might need and then some more in an accessible and
            intuitive package.
          </Typography>
        </Grid>
        <Grid
          size={12}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={1}
          className="plansection__buttons"
        >
          <CustomButton label="Monthly" />
          <CustomButton label="Annualy" variant="outlined" />
        </Grid>
        <Grid
          size={12}
          display={'flex'}
          columnSpacing={5}
          container
          className="plansection__cards"
        >
          {new Array(3).fill('').map((_, index) => (
            <Grid size={4} key={index} className="plansection__card">
              <PlanCard />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
};
