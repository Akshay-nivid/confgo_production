import { NewRegistration, ExistingUsers, SoldTickets } from "@/assets/svg";
import useStore, { POST } from "@/Libs/store"
import { Logger } from "@/Utils/Logger";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";
import confgo from "../../../config.json";

/**
 * EventFeedBack component displays feedback information for an event,
 * including counts like new registrations, total users, and ticket sales.
 * 
 * @returns JSX to render the event feedback section with the data fetched from API.
 */
const EventFeedBack = () => {

    const currency=confgo?.currency

    const eventId = useStore((state: any) => state?.nonPersistedData?.CustomSelectData?.data) ?? [];
     
    const counts = useStore((state: any) => state?.compData?.countByEventData?.["dashboard/countByEvent"]?.data) || {};

 
    /**
     * Using useEffect hook to fetch data when eventId changes
     */

    useEffect(() => {

        /**
        *   Function to fetch the event feedback data (like total registrations, users, etc.)
        * */
    const details = async () => {

        if (eventId == null) return;
        
        try {
            POST({
                url: `dashboard/countByEvent`,
                body: {
                    eventId:Number(eventId) 
                },
                id: 'countByEventData',
                successCB: (_data: any) => {
                },

            })
        } catch (error) {
            Logger.error("Error fetching event count:", error);
        }
    }

        details();
    }, [eventId]);


    /**
     * Mapping for the icons, counts, and titles
     */

    const boxArray = [
        {
            id: 1,
            icon: <NewRegistration  />,
            info: 'New Registration',
            count: counts?.totalRegistrations
            
        },
        {
            id: 2,
            icon: <ExistingUsers  />,
            info: 'Total Attendees',
            count: counts?.totalCheckIns

        }, {
            id: 3,
            icon: <SoldTickets  />,
            info: 'Total Revenue',
            count: counts?.totalAmount
        }]

    return (
        <Grid container className="eventFeedBack-box" size={12} spacing={2}>

            {boxArray.map((item: any, index: any) => (

                <Grid size={{xs:12,sm:6,md:4 }} minHeight={"1rem"} className="eventFeedBack-box-container" container spacing={2} key={index}>

                    <Grid size={12} className="eventFeedBack-box-container-icon" >

                        {item?.icon}

                    </Grid>

                    <Grid className="eventFeedBack-box-container-usersCount"  size={12} >

                        <Typography className="content-count">
                            {index == 2 ? `${currency}${item?.count ?? 0}` : item?.count ?? 0}
                        </Typography>

                    </Grid>

                    <Grid className="eventFeedBack-box-container-title">

                        <Typography className="content">

                            {item?.info}

                        </Typography>

                    </Grid>

                </Grid>

            )
            )
            }

        </Grid>
    )
}
export default EventFeedBack;