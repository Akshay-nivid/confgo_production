
import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography } from "@mui/material";
import  noimg  from "./../../assets/png/Group.png";

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
                <Grid size={8}>
                    <Grid size={12}>
                        <Typography className="dashboard-left-profile-accounttitle" variant="body1">No Attended Events</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Typography >
                            It looks like you haven’t registered for any upcoming events. Don’t miss out on exciting opportunities!
                        </Typography>
                    </Grid>
                </Grid>
                <Grid size={4}>
                <img src={noimg} className="no-record-image"  alt="No records found" />
                </Grid>
  </Grid>

));

export default NoDataCard;
