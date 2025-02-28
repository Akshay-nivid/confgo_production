import { Abstracts, EventMessage, EventPhone, NewPrice} from "@/assets/svg";
import useStore, { GET } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { Typography } from "@mui/material";
import Grid  from "@mui/material/Grid2";
import { useEffect } from "react";
import confgo from "../../../../../config.json";
/*
 * conponent for Event Contact Details
 */
const EventContactCard=(id:any)=>{

    const {data}=id;
    const currency = confgo?.currency
    useEffect(()=>{
        
    })
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
            icon:event?.data?.amount?<NewPrice/>:'',
           info: event?.data?.amount ? `${currency}${event?.data?.amount}` : ''
        },
        {
            id:2,
            icon:event?.data?.abstractDate?<Abstracts/>:'',
            info:event?.data?.abstractDate?event?.data?.abstractDate:''
        },
        {
            id:3,
            icon:event?.data?.eventContacts[0]?.email?<EventMessage/>:'',
            info:event?.data?.eventContacts[0]?.email?event?.data?.eventContacts[0]?.email:''
        },
        {
            id:4,
            icon: event?.data?.eventContacts[0]?.phone?<EventPhone/> : '',
            info:event?.data?.eventContacts[0]?.phone?event?.data?.eventContacts[0]?.phone:''
        },
       
    ]
    /**
     *  Remove items where info is empty
     */
    const filteredBoxArray = boxArray.filter(item => item.info); 

   
   return(
    
    <Grid container className="EventContactCard-grid"  size={12} spacing={0}>
        
        <Grid className="EventContactCard-grid-box"  size={12} container spacing={event?.data?.eventContacts?.[0]?.length >0 ?0 :2} maxHeight={'max-content'}>
               <Grid>

                <Typography className="heading-title">
                    
                Event Informations

                </Typography>

               </Grid>

               {filteredBoxArray?.every(item => !item.info) ? (
                   <Grid size={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>No Contacts Available</Grid>
               ) : (
                filteredBoxArray?.map((item: any, index: any) => (
                       <Grid size={12} display={"flex"} key={index}  alignItems={"center"} gap={2}  maxHeight={"max-content"}>


                           <Grid className="EventContactCard-grid-box-details">

                               {item?.icon}


                           </Grid>

                           <Grid display={"flex"} justifyContent={"center"} alignItems={"center"} className=" EventContactCard-grid-box-content ">

                               <Typography className="mail-phn">

                                   {item?.info}

                               </Typography>
                           </Grid>

                       </Grid>))
               )}

        </Grid>


    </Grid>
   )
}
export default EventContactCard;