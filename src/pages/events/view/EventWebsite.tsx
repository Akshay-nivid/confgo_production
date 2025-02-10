import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import Grid  from "@mui/material/Grid2";

const EventWebsite=()=>{
      return(
        <Grid container size={6} bgcolor={"lightblue"} className="EventWebsite-grid" >
             <Grid  size={12} className="EventWebsite-grid-content" container spacing={1}>
                   <Grid  className="EventWebsite-grid-content-title" >
                    
                        <Typography className="header">

                        View your event website

                        </Typography>

                   </Grid>

                   <Grid size={12}>
                    
                    <CustomButton label="View-website" className="EventWebsite-grid-content-View-website"/>

                   </Grid>
             </Grid>
        </Grid>
      )
}

export default EventWebsite;