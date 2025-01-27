import Grid from "@mui/material/Grid2";
import { MaintenanceIcon } from "@/assets/svg";
import { Typography } from "@mui/material";

/**
 * Displays a maintenance page when the event is unpublished or the website is undergoing updates.
 */
const MaintenancePage = () => {
  return (
    <Grid container className="maintenance-page">
      <Grid container>
        <Grid>
          <MaintenanceIcon className="maintenance-page-image" />
        </Grid>
        <Grid className="maintenance-page-text-grid">
          <Typography className="maintenance-page-title">
            Site Under Maintenance
          </Typography>
          <Typography className="maintenance-page-description">
            Our website is getting a makeover to serve you better. Hang
            tight—we’ll be back online soon!
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MaintenancePage;
