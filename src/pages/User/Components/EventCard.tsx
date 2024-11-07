import React from 'react';
import Grid from '@mui/material/Grid2';
import { Divider, Typography } from '@mui/material';
import { formatDateDayMonthYear } from '@/Utils/DateFormat';
import StatusComponent from '@/components/Status/StatusComponent';
import CustomButton from '@/components/CustomButton/CustomButton';

interface EventProps {
    datetitle: string;
    title?: string;
    location?: string;
    eventFullData: any;
    viewCertificate?: boolean;
    viewEventRecap?: boolean;
    viewButton?: boolean;
    squareButton?:boolean;
    buttonPress?:()=>void;
    squareButtonLabels:string[]
    onSquareButtonClick?: (index: number) => void;
}


const EventCard: React.FC<EventProps> = React.memo(({ datetitle, title, location, viewButton,buttonPress,squareButton,squareButtonLabels,onSquareButtonClick }) => {
    return (
        <Grid container className="event-card" spacing={1} flexDirection={"column"}>
            <Grid container className="event-card-date-box" justifyContent={"center"}>
                <Typography textAlign={"center"}>Date: {formatDateDayMonthYear(datetitle)}</Typography>
            </Grid>
            <Grid container>
                <Typography className='event-card-title'>{title}</Typography>
            </Grid>
            <Grid container>
                <Typography>Location: {location}</Typography>
            </Grid>
            
            <Grid className="event-card-status" container display={"flex"} alignContent={"center"}  >
                <Typography>Status</Typography><StatusComponent value="1" />
            </Grid>
            {squareButton &&
                <Grid className="event-card-certificate" container display={"flex"}>
                    {squareButtonLabels.length>1?<><Typography onClick={() => onSquareButtonClick && onSquareButtonClick(0)} className='event-card-certificate-label'>
                        [{squareButtonLabels[0]}]
                    </Typography>
                    <Typography className='event-card-certificate-label' onClick={() => onSquareButtonClick && onSquareButtonClick(1)}>[{squareButtonLabels[1]}]</Typography>
                    </>:<Typography className='event-card-certificate-label' onClick={() => onSquareButtonClick && onSquareButtonClick(0)}>
                        [{squareButtonLabels[0]}]
                    </Typography>}
                </Grid>}
                {viewButton&&
                <Grid size={{xs:6}}>
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
