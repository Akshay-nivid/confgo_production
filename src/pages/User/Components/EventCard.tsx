import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import StatusComponent from '@/components/Status/StatusComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import { formatDateTimeRange, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';

interface EventProps {
    datetitle: string;
    title?: string|undefined;
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
const EventCard: React.FC<EventProps> = React.memo(({ eventFullData, datetitle, title, location, viewButton, buttonPress, squareButton, squareButtonLabels, onSquareButtonClick, Eventstatus }) => {
   const attendeeStatus=eventFullData?.participants[0]?. eventParticipants[0]?.event.attendees
    return (
        <Grid container className="event-card" spacing={1} flexDirection={"column"}>
            <Grid container className="event-card-date-box" justifyContent={"center"}>
                <Typography textAlign={"center"} className="event-card-date-title" >Date: {formatDateTimeRange({ date: datetitle, format: 'MMMM D, YYYY' })}</Typography>
            </Grid>
            <Grid  container>
            <Typography className="event-card-title" >
                {truncateString(toTitleCase(title), 23, "Untitled")}
                </Typography>
            </Grid>
            <Grid container>
            <Typography className="event-card-location">
                 Location: {truncateString(location, 20, "Location not specified")}
                 </Typography>
            </Grid>
            {Eventstatus &&
                <Grid  className="event-card-status" container size={12}>
                    <Grid container size={12} className="content">
                        <Typography className="event-card-location">Status</Typography>
                        <StatusComponent value={attendeeStatus.length==0 ? 7 : 8}  />
                    </Grid>
                </Grid>}
            {squareButton &&
                <Grid className="event-card-certificate" container display={"flex"}>
                    {squareButtonLabels.length > 1 ? <><Typography onClick={() => onSquareButtonClick && onSquareButtonClick(0)} className='event-card-certificate-label'><u>
                        [{squareButtonLabels[0]}]
                        </u></Typography>
                        <Typography className='event-card-certificate-label-bar'>|</Typography>
                        <Typography className='event-card-certificate-label' onClick={() => onSquareButtonClick && onSquareButtonClick(1)}><u>
                             [{squareButtonLabels[1]}]</u></Typography>
                    </> : <Typography className='event-card-certificate-label' onClick={() => onSquareButtonClick && onSquareButtonClick(0)}>
                        [{squareButtonLabels[0]}]
                    </Typography>}
                </Grid>}
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
