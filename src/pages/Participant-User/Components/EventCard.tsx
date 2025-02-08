import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import StatusComponent from '@/components/Status/StatusComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import { toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import CustomTooltip from '@/components/CustomToolTip/CustomTooltip';
import moment from 'moment';
import routes from '@/router/routes';
import { useNavigate } from 'react-router';
import Config from "../../../../config.json";
import EventTypeText from './EventType';

interface TimeProps {
    startTime: string;
    endTime: string;
}
interface EventProps {
    id?: number;
    datetitle: TimeProps;
    title?: string | undefined;
    location?: string;
    eventFullData: any;
    viewCertificate?: boolean;
    viewEventRecap?: boolean;
    viewButton?: boolean;
    squareButton?: boolean;
    buttonPress?: () => void;
    squareButtonLabels: string[]
    onSquareButtonClick?: (index: number) => void;
    Eventstatus?: boolean;
}
/**
 * user Dashboard eventCard component
 */
const EventCard: React.FC<EventProps> = React.memo(({ id, eventFullData, datetitle, title, location, viewButton, buttonPress }) => {
    const attendeeStatus = eventFullData?.participants[0]?.eventParticipants[0]?.event?.attendees
    const navigate = useNavigate();

    /**
     * Compares the given end date (`datetitle?.endTime`) with today's date.
    */
    const today = moment().startOf('day');
    const endDate = moment(datetitle?.endTime);
    const isEndDatePast = endDate.isBefore(today, 'day');
    /**
    * Handles event propagation
    */
    // const propogation = (e:any) => {
    //   e.stopPropagation();
    //   onSquareButtonClick && onSquareButtonClick(0);
    // };
    const baseUrl = Config.api.url;
    return (
        <Grid container className="event-card" spacing={1} flexDirection={"column"} onClick={() => navigate(routes.userEventRecap(), { state: { eventId: id } })}>
            <Grid container justifyContent={"flex-start"} display={"flex"}>
                <Grid className="logo-box" alignContent={"center"} >
                    {eventFullData?.assetId && <img src={`${baseUrl}asset/${eventFullData?.assetId}`} alt='' />}
                </Grid>
                <Grid display={"block"}>
                    <CustomTooltip title={title}>
                        <Typography className="event-card-title" >
                            {truncateString(toTitleCase(title), 23, "Untitled")}
                        </Typography>
                    </CustomTooltip>
                    <Grid display={"flex"} alignItems={"center"} columnGap={2}>
                        <EventTypeText status={eventFullData.eventClass} className='eventClassType' />
                        <Grid className="vertical-divider" />
                        {isEndDatePast ? <StatusComponent value="11" /> :
                            <StatusComponent value={attendeeStatus?.length == 0 ? "7" : "8"} />}
                    </Grid>
                </Grid>
                {/* <Typography textAlign={"center"} className="event-card-date-title" >Date: {formatDateTimeRange({ date: datetitle?.startTime, format: 'MMM D' })+"-"+ formatDateTimeRange({ date: datetitle?.endTime, format: 'MMM D' })}</Typography> */}
            </Grid>
            {/* <Grid  container>
            <CustomTooltip title={title}>
                <Typography className="event-card-title" >
                {truncateString(toTitleCase(title), 23, "Untitled")}
                </Typography>
               </CustomTooltip> 
            </Grid> */}
            <Grid className="horizontal-dotted-divider" />
            <Grid container display={"flex"} className="event-card-info" justifyContent={"space-between"}>
                <Grid className="left-container" >
                    <Typography textAlign={"start"} className='title'>
                        DATE
                    </Typography>
                    <Typography className='title-value'>{moment(eventFullData?.startTime).format('Do MMMM')}</Typography>
                    <Typography className='title-value'>{moment(eventFullData?.startTime).format('YYYY')}</Typography>
                    {/* <Typography className="event-card-location">
                 Location: {truncateString(location, 20, "Location not specified")}
                 </Typography> */}
                </Grid>
                <Grid className="left-container" >
                    <Typography textAlign={"start"} className='title'>
                    {eventFullData.eventClass!="ONLINE"?  "LOCATION":"URL"}
                    </Typography>
                    <Typography className='title-value'>{eventFullData.eventClass!="ONLINE"? truncateString(location, 20, "Location not specified"): truncateString(eventFullData?.url, 15, "URL not specified")}</Typography>
                </Grid>
            </Grid>
            {/* {Eventstatus &&
                <Grid  className="event-card-status" container size={12}>
                    <Grid container size={12} className="content">
                        <Typography className="event-card-location">Status</Typography>
                        {isEndDatePast? <StatusComponent value="11"/>:
                        <StatusComponent value={attendeeStatus?.length==0 ? "7" : "8"}  />}
                    </Grid>
                </Grid>} */}
            {/* {squareButton &&
                <Grid className="event-card-certificate" container display={"flex"}>
                    <Typography onClick={propogation} className='event-card-certificate-label'>
                    <u>[{squareButtonLabels[0]}]</u>
                        </Typography>
                </Grid>} */}
            {viewButton &&
                <Grid size={{ xs: 6 }}>
                    <CustomButton
                        onClick={buttonPress}
                        className='event-card-button'
                        label='Register Now'
                        variant='contained'
                    /></Grid>}
        </Grid>
    );
});

export default EventCard;
