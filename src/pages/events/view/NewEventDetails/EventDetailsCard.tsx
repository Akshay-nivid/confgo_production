import Grid from "@mui/material/Grid2";
import {Chip, Typography } from "@mui/material";
import HTMLReactParser from 'html-react-parser/lib/index';
import { EventCalendar, EventLocation, HybridIcon} from "@/assets/svg";
import moment from "moment";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { setDataById } from "@/Libs/store";
import { truncateString } from "@/Utils/CommonBaseClass";
import { useEffect, useState } from "react";
import { Logger } from "@/Utils/Logger";
const EventDetailsCard = (eventData: any) => {


    const { name, eventClass, description, startTime, endTime ,venue,id,url} = eventData?.data || {};

    /**
     * store the url
     */
    useEffect(()=>{

    setDataById("urlId",{url:url});
      
    },[]);

    const copyUrl = useStore((state : any)=>state?.compData?.['urlId']?.url);

       
    /**
     * Natigate to program Details page
     */
    const viewProgramme=(_id:any)=>{
        setDataById("tabValue", { value: '3' });
    }
    
    /**
     * Handle event Edit deatils drawer
     */
    const editDrawer =()=>{
        if (!eventData) return; 
        
        if(eventData?.published){
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "error",
              message: "Event is Already Published !",
            });
            setDataById("eventDrawer", { value: false }); 
            return;
          }
          else{
            setDataById("eventDrawer", { value: true });   
          }

        

            
    }
    const [showFullText, setShowFullText] = useState(false);
    /**
    * Truncate text
    */
    const truncatedString =truncateString(description,210);


     /**
   * Method handles the copy to clipboard functionality
   */
  const handleEventCopy = () => {
    
    if (copyUrl) {
  
      navigator.clipboard.writeText(copyUrl)
        .then(() => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Text copied to clipboard' });
        })
        .catch((err) => {
          Logger.error("Failed to copy text: ", err);
        });
    }
  }
    return (
        <Grid container size={12} className="Event-BasicInfo">

            <Grid className="Event-BasicInfo-titles" size={12} container spacing={1}>

                <Grid display={'flex'} size={12} flexWrap={"nowrap"} >

                    <Typography className="heading">
                        {name} 
                    </Typography>
                    
                    <Chip label={eventClass} className="about-btn min-w-max" ></Chip>

                </Grid>



               {description&&
                <Grid className="description" spacing={0} display="flex" >
                   
                    
                    <Typography  className=" cursor-pointer inline" onClick={() => setShowFullText(!showFullText)} >


                           <span className=""> {showFullText ? HTMLReactParser(description)  : HTMLReactParser(truncatedString)}

                            {description?.length > 210 &&(
                         <span className="text-cyan-400"> {showFullText ? "View Less" : "View More" }</span> 
                         )}
                           </span>
                            

                        </Typography>
                      
                      
                </Grid>
                
                }

            </Grid>

        <Grid  container size={12} spacing={1}>
            <Grid container size={{lg:6,sm:12}} spacing={2} mt={3} className="Info-time" >
           
                <Grid size={12} display={"flex"} gap={1}>

                    <Grid container justifyContent={"center"} alignItems={"center"} className="svg">

                       
                    <EventCalendar/>

                    </Grid>

                    <Grid   container size={12} display={"flex"} alignItems={"center"}>


                        <Grid container  size={12}>

                            <Typography className="date">

                            {moment(startTime).format("MMM D, hh:mm A") + " - " + moment(endTime).format("MMM D,hh:mm A")
                            }
                              
                            </Typography>

                        </Grid>
                    </Grid>

                </Grid>

                { venue?.address&&(
                <Grid size={12} display={"flex"} gap={1}  justifyContent={"flex-start"}>

                    <Grid container justifyContent={"center"} alignItems={"center"} className="svg" >

                       
                    <EventLocation/>

                    </Grid>

                    <Grid   container size={12} display={"flex"} alignItems={"center"}>


                        <Grid container  size={12}>

                            <Typography className="date">

                              {venue?.address}
                          
                            </Typography>

                        </Grid>
                    </Grid>

                </Grid>)}

                {url &&(
                <Grid size={12} display={"flex"} gap={1}  justifyContent={"flex-start"} className="cursor-pointer" onClick={handleEventCopy} >    

                    <Grid container justifyContent={"center"} alignItems={"center"} className="svg" >

                       
                    <HybridIcon/>

                    </Grid>

                    <Grid   container size={12} display={"flex"} alignItems={"center"}>

                        

                        <Grid container  size={12}>

                            <Typography className="date">

                              {url}
                          
                            </Typography>

                        </Grid>
                    </Grid>

                </Grid>)}

            </Grid>
           
            <Grid size={{lg:6,sm:12}} className=" Event-BasicInfo-viewProgram"  display={"flex"} alignItems={"flex-end"}  justifyContent={{ sm: "flex-start", lg: "center" }}  gap={1}>
                
                <Grid flex={1}  >
                    <CustomButton
                    fullWidth
                    label="View Programs" className="btn"
                    onClick={()=>viewProgramme(id)}
                    />
                 </Grid>
                 
                 <Grid flex={1} >
                    <CustomButton
                    fullWidth
                    label="Edit Event" className="btn2"
                    onClick={editDrawer}
                    />

                 </Grid>

             

            </Grid>
            </Grid>
           


        </Grid>
    )
}
export default EventDetailsCard;