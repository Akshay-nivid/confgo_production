import { EventMessage, EventPhone } from "@/assets/svg";
import useStore, { GET } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { Typography } from "@mui/material";
import Grid  from "@mui/material/Grid2";
import { useEffect } from "react";

/*
 * conponent for Event Contact Details
 */
const EventContactCard=(id:any)=>{

    const {data}=id;
  
    const event = useStore( (state: any) => state.compData?.eventIdData?.[`event/${data}`]  ) || {};
    
  
    
    /**
     * Fetching Event contact Details
     */
    useEffect(()=>{
   
    const EventContact= async()=>{

        try{
           if(data){
             await GET({

                url:`event/${data}`,

                id:"eventIdData",

                    errorCB:(error:any)=>{
                      Logger.error(error?.message)
                    }
             }
            )
            }
        }catch(err)
        {
          Logger.error("error in event/id from EventContactCard component ",err)
        }
        
    };
        EventContact();  
    },[data]);

    const boxArray=[
        {
            id:1,
            icon:<EventMessage/>,
            info:event?.data?.eventContacts[0]?.email
        },
        {
            id:2,
            icon:<EventPhone/>,
            info:event?.data?.eventContacts[0]?.phone
        }

    ]
    if (event?.data?.eventContacts.length === 0) {
        return null;
      }
   return(
    
    <Grid container className="EventContactCard-grid" size={12} spacing={0}>
        
        <Grid className="EventContactCard-grid-box"  size={12} container spacing={2}>
               <Grid>

                <Typography className="heading-title">
                    
                Contact Informations

                </Typography>

               </Grid>

               {boxArray?.map((item:any,index:any)=>(

               <Grid size={12} display={"flex"} gap={2} key={index}>
               

                <Grid className="EventContactCard-grid-box-details"  >
                     
                     {item?.icon}


                </Grid>

                <Grid display={"flex"} justifyContent={"center"} alignItems={"center"} className=" EventContactCard-grid-box-content ">

                    <Typography className="mail-phn">

                   {item?.info}

                    </Typography>
                </Grid>

 </Grid> ))}
 
        </Grid>

        {/* call
        
              <Grid container size={4}>
                 <EventContactCard data={eventData?.id}/>
              </Grid> */}

    </Grid>
   )
}
export default EventContactCard;