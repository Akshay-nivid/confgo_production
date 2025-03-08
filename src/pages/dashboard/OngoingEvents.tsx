import { EventDetailsIcon } from "@/assets/svg";
import useStore, { POST, setNonPersistedDataById } from "@/Libs/store";
import routes from "@/router/routes";
import { Logger } from "@/Utils/Logger";
import { StatusEnum } from "@/Utils/StatusEnum";
import { Avatar, AvatarGroup, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../../config.json";
import { formatDate } from "@/Utils/CommonBaseClass";


/**
 * OngoingEvents Component
 * 
 * Displays details of an ongoing event, including its name, date, location, 
 * event type, and speakers. It also provides a button to view  event details.
 * 
 * @param {Object} data - Event data containing event details and speaker list.
 * @returns {JSX.Element} - Renders event details in a grid layout.
 */

const OngoingEvents = (data: any) => {
    const navigate = useNavigate();
    const speakerList = useStore(state => state.nonPersistedData.UpcomingSpeakerList?.data) ?? [];
    const baseUrl = config.api.url;
      const [isVisible, setIsVisible] = useState(true);

    /**
    * Row click navigation
    */
    const handleRowClick = (id: number | string, data: any) => {
        data.statusId === StatusEnum.DRAFTED ? navigate(routes.editDraftEvent(id)) 
        : navigate(routes.viewEvent(id))
    };
    
    useEffect(() => {
        // Start blinking effect
        const interval = setInterval(() => {
          setIsVisible((prev) => !prev);
        }, 500); // Adjust blink speed (milliseconds)
      
        // Fetch speaker list
        fetchSpeakerList();
      
        // Cleanup function
        return () => clearInterval(interval);
      }, []);


    /**
    * fetching Speakers list
    */
    const fetchSpeakerList = async () => {
        try {
             POST({
                url: "eventSpeaker/list",

                body: {
                    filters: {
                        parentEventId: data?.data?.id
                    }
                },

                id: 'fullEventList',

                successCB: (data: any) => {

                    setNonPersistedDataById("UpcomingSpeakerList", { data: data?.data });

                },
                errorCB: (context: any) => {

                    Logger.error('Dashboard', context?.message);

                }
            });
            return;
        }
        catch (error) {
            Logger.error("SpeakerCard.tsx", error);
        }
    };
    return (


        <Grid container height={"max-content"} size={12} spacing={1} className="adminDashBoard-upComing-Events">

            <Grid size={12} className="adminDashBoard-upComing-Events-header" container  >

                <Grid size={6} container alignItems={"center"}>  <div  className={`live-icon ${isVisible ? "visible" : ""}`} /> <Typography className="ongoing-event-header-title">Ongoing Event</Typography>
                </Grid>

                <Grid display={"flex"} justifyItems={"flex-end"} alignItems={"center"} gap={1} size={6} justifyContent={"flex-end"}>


                    <Grid container spacing={1} onClick={() => handleRowClick(data?.data?.id, data?.data)} className="view-details">

                        <Typography className="view-details-details-btn">View Details</Typography>

                        <Grid container className="pt-1">

                            <EventDetailsIcon /></Grid>

                    </Grid>

                </Grid>



            </Grid>

            <Grid container size={12} className="adminDashBoard-upComing-Events-details" spacing={3}>

                <Grid size={12} >

                    <Typography className="adminDashBoard-upComing-Events-details-heading">{data?.data?.name}</Typography>

                </Grid>


                <Grid container size={12} className="adminDashBoard-upComing-Events-about" spacing={3} >
                    <Grid size={12} className="date" container spacing={0}>

                        <Grid size={3} >
                            <Typography className="about-title">
                                Date
                            </Typography>
                        </Grid>

                        <Grid size={9} >
                            <Typography className="about-content">

                                {formatDate(data?.data?.startTime,"MMMM D")}-{formatDate(data?.data?.endTime,"D, YYYY")}

                            </Typography>
                        </Grid>

                    </Grid>

                    {data?.data?.eventClass === "OFFLINE" && (
                        <Grid size={12} className="location" container spacing={0}>

                            <Grid size={3} >

                                <Typography className="about-title">
                                    Location
                                </Typography>

                            </Grid>

                            <Grid size={9}>

                                <Typography className="about-content">
                                    {data?.data?.venue?.address}
                                </Typography>

                            </Grid>

                        </Grid>)}

                    <Grid size={12} className="location" container spacing={0}>

                        <Grid size={3}>

                            <Typography className="about-title">
                                Type
                            </Typography>

                        </Grid>

                        <Grid size={9}>

                            <Button className="about-btn" >{data?.data?.eventClass}</Button>

                        </Grid>

                    </Grid>

                    {speakerList?.length !== 0 && (

                        <Grid size={12} className="location" container spacing={0}>

                            <Grid size={3} >

                                <Typography className="about-title">
                                    Speaker
                                </Typography>

                            </Grid>
                            <Grid size={9} container flexDirection={"row"} >
                            <AvatarGroup max={4}>
                                {speakerList?.map((item: any, index: any) => (

                                    <Grid   flexDirection={"column"} key={index} >

                                        {item?.user?.assetId !== null ? (
                                            
                                            <Avatar
                                                className="about-img-avatar"
                                                src={`${baseUrl}asset/${item?.user?.assetId}`}
                                                alt="" />
                                        ) : (

                                            <Avatar className="about-avatar">

                                                {`${item?.user?.firstName[0]}${item?.user?.lastName[0]}`.toUpperCase()}

                                            </Avatar>

                                        )}
                                    </Grid>


                                ))}
                                </AvatarGroup>

                            </Grid>


                        </Grid>
                    )}



                </Grid>


            </Grid>

        </Grid>

    )
}

export default OngoingEvents;

