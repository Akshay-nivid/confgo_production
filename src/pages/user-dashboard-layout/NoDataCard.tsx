
import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography } from "@mui/material";
import { NoDataSvg } from "@/assets/svg";

/**
 * Reusable no events card
 * @author Neethu
 */
const NoDataCard: React.FC = React.memo(() => (

  <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    className="no-record-container"
    size={{ xs: 12 }}
  >
    <Grid >
    <NoDataSvg className="no-record-image" />
    </Grid>
    <Grid >
      <Typography className="no-record-title">
        No Events Found
      </Typography>
      <Typography className="no-record-subtitle" >
        It looks like you haven’t created any data yet.
      </Typography>
    </Grid>
  </Grid>

));

export default NoDataCard;
