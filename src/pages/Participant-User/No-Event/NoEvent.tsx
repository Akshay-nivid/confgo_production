import React from "react";
import Grid from "@mui/material/Grid2";
import { NoEvent as NoEventIcon } from "@/assets/svg";
import { Typography } from "@mui/material";
 interface NoEventsProps {
  title?:string;
  description?:string
}
const NoEvents: React.FC<NoEventsProps> = React.memo(({title,description}) => {
    return(
        <Grid container size={12} justifyContent={"center"}>
        <Grid  container justifyContent={"center"}  className="no-event" >
        <Grid>
        <NoEventIcon className="no-event-svg" />
        </Grid>
        <Grid size={12} flexDirection={"column"}>
          <Typography className="no-event-svg-text">{title}</Typography>
          <Typography className="no-event-svg-text-description">{description}</Typography>
        </Grid>
            </Grid> 
      </Grid>
    )
})
export default NoEvents;