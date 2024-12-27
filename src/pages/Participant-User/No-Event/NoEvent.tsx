import React from "react";
import Grid from "@mui/material/Grid2";
import { NoEvent as NoEventIcon } from "@/assets/svg";
import { Typography } from "@mui/material";
const NoEvents: React.FC = React.memo(() => {
    return(
        <Grid container size={12} justifyContent={"center"}>
        <Grid  container justifyContent={"center"}  className="no-event" >
        <Grid>
        <NoEventIcon className="no-event-svg" />
        </Grid>
        <Grid size={12} flexDirection={"column"}>
          <Typography className="no-event-svg-text">No Events Found</Typography>
          <Typography className="no-event-svg-text-description">You haven’t registered for any events yet. Explore upcoming events and secure your spot today!</Typography>
        </Grid>
            </Grid> 
      </Grid>
    )
})
export default NoEvents;