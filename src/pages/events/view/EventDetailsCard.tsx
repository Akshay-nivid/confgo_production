import Grid from "@mui/material/Grid2";
import { Chip, Typography } from "@mui/material";
import HTMLReactParser from 'html-react-parser/lib/index';
import { EventCalendar, EventLocation} from "@/assets/svg";
import moment from "moment";
const EventDetailsCard = (eventData: any) => {
   

    const { name, eventClass, description, startTime, endTime ,venue} = eventData?.data;
 
    const boxArray = [
        {
            id: 1,
            icon:<EventCalendar/> ,
            label: 'Date & Time',
            info:moment(startTime).format('MMM D') + ' - ' + moment(endTime).format('MMM D, YYYY')

        },
        {
            id: 2,
            icon: <EventLocation/>,
            label: 'Location',
            info: venue?.address
        }]

    return (
        <Grid container size={12} className="Event-BasicInfo">

            <Grid className="Event-BasicInfo-titles" size={12} container spacing={1}>

                <Grid display={'flex'} size={12} flexWrap={"nowrap"} >
                    <Typography className="heading">
                        {name} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos qui repellat saepe error aut omnis. Eos quam voluptatum sit eligendi.
                    </Typography>
                    <Chip label={eventClass} className="about-btn min-w-max" ></Chip>

                </Grid>




                <Grid className="description" spacing={0}>

                    {HTMLReactParser(description)}

                </Grid>

            </Grid>

            <Grid container size={12} spacing={3} mt={3} className="Event-BasicInfo-time">
            {boxArray.map((item:any,index:any) => (
                <Grid size={12} display={"flex"} gap={1} key={index}>

                    <Grid container justifyContent={"center"} alignItems={"center"} className="svg">

                        {/* <EventCalendar /> */}
                    {item?.icon}

                    </Grid>

                    <Grid   container size={12}>

                        <Grid container    size={12} >

                            <Typography className="title">

                                {item?.label}

                            </Typography>
                        </Grid>

                        <Grid container  size={12}>

                            <Typography className="date">

                              {item?.info}
                            </Typography>

                        </Grid>
                    </Grid>

                </Grid>
            ))}

            </Grid>


           {/* Call <Grid container size={8}>
      <EventDetailsCard data={eventData}/>

      </Grid> */}


        </Grid>
    )
}
export default EventDetailsCard;