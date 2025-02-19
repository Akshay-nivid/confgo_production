import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import Grid  from "@mui/material/Grid2";

import useStore from "@/Libs/store";

/**
 * This component renders a section that allows the user to view their event website. 
 */
interface website{
      published?:boolean
} 

const EventWebsite = ({published }: website) => {
    
     
    
      /**
       * SlugName
       */
      const updatedSLUG= useStore(state=>state?.compData?.['slugUpdate']?.slug)?? null;
      

      return(
        <Grid container size={12}  className="EventWebsite-grid" >
             <Grid  size={12} className="EventWebsite-grid-content" container spacing={1}>
                   <Grid  className="EventWebsite-grid-content-title" >
                    
                        <Typography className="header">

                        View your event website

                        </Typography>

                   </Grid>
               {!published
               &&(

                <Grid container size={{lg:12,sm:6}} justifyContent={"center"} alignItems={"center"} spacing={0} minHeight={"max-content"}>

                    <Grid className="EventWebsite-grid-content-publishText" >

                    Please publish the event!

                        </Grid>


                </Grid>

                )}
                   <Grid size={12}>
                    {published?(
                    <CustomButton label=  "View-website"    
                      onClick={() => window.open(updatedSLUG,'_blank')} 

                    className="EventWebsite-grid-content-View-website"/>
                    ):(
                    
                     <Grid></Grid>
                    )}
                   </Grid>
             </Grid>
        </Grid>
      )
}

export default EventWebsite;