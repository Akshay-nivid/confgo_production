import Grid from "@mui/material/Grid2";
import { Chip, Typography } from "@mui/material";
import HTMLReactParser from 'html-react-parser/lib/index';
import { EventCalendar, EventLocation} from "@/assets/svg";
import moment from "moment";
import CustomButton from "@/components/CustomButton/CustomButton";
import { setDataById } from "@/Libs/store";
const EventDetailsCard = (eventData: any) => {

    const { name, eventClass, description, startTime, endTime ,venue,id} = eventData?.data || {};
 
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
        setDataById("eventDrawer", { value: true });   
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
                <Grid className="description" spacing={0}>
                   
                    {HTMLReactParser(description)}
                    
                </Grid>}

            </Grid>

        
            <Grid container size={12} spacing={3} mt={3} className="Event-BasicInfo-time">
            {/* {boxArray?.map((item:any,index:any) => ( */}
                <Grid size={12} display={"flex"} gap={1} >

                    <Grid container justifyContent={"center"} alignItems={"center"} className="svg">

                       
                    <EventCalendar/>

                    </Grid>

                    <Grid   container size={12}>

                        <Grid container    size={12} >

                            <Typography className="title">

                            Date & Time
                            </Typography>
                        </Grid>

                        <Grid container  size={12}>

                            <Typography className="date">

                            {moment(startTime).format("MMM D, hh:mm A") + " - " + moment(endTime).format("MMM D,hh:mm A, YYYY ")
                            }
                              
                            </Typography>

                        </Grid>
                    </Grid>

                </Grid>
            

            </Grid>

            <Grid container size={12} spacing={3} mt={3} className="Event-BasicInfo-time" justifyContent={{sm:"flex-start",lg:"flex-end"}}>
                {eventClass==="OFFLINE" &&(
                <Grid size={6} display={"flex"} gap={1}  justifyContent={"flex-start"}>

                    <Grid container justifyContent={"center"} alignItems={"center"} className="svg" >

                       
                    <EventLocation/>

                    </Grid>

                    <Grid   container size={12}>

                        <Grid container    size={12} >

                            <Typography className="title">

                               Location

                            </Typography>
                        </Grid>

                        <Grid container  size={12}>

                            <Typography className="date">

                              {venue?.address}
                          
                            </Typography>

                        </Grid>
                    </Grid>

                </Grid>)}
                <Grid size={{lg:6,sm:12}} className="Event-BasicInfo-viewProgram"  display={"flex"} alignItems={"end"} justifyContent={"flex-end"} gap={1}>
                
                <Grid size={6} container >
                    <CustomButton
                    fullWidth
                    label="View Programmes" className="btn"
                    onClick={()=>viewProgramme(id)}
                    />
                 </Grid>
                 <Grid size={6} container>
                    <CustomButton
                    fullWidth
                    label="Edit Event Details" className="btn2"
                    onClick={editDrawer}
                    />

                 </Grid>

                </Grid> 
          

            </Grid>


        </Grid>
    )
}
export default EventDetailsCard;