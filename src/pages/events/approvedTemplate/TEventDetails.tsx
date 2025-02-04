import React from 'react'
import Grid from '@mui/material/Grid2';
import { DownArrow } from '@/assets/svg';
import { Typography } from '@mui/material';
import parse from 'html-react-parser';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import { getLocalTimeDate } from '@/Utils/CommonBaseClass';
/**
 * Components handle Event Details
 */
const TEventDetails: React.FC<any> = React.memo(({ className, data }) => {

    return (
        <Grid size={12} container className={className} direction={'row'}>
            <Grid size={1} className={`${className}-firstContainer`}>
                <Typography> Scroll Down</Typography><DownArrow />
            </Grid>
            <Grid size={4} container  className={`${className}-welcome`}>
                <Typography className={`${className}-title`}>Welcome to {data?.name}</Typography>
            </Grid>
            <Grid size={6} container direction={'column'} justifyContent={'center'} alignItems={'center'}>
                <Grid>
                    <Typography className={`${className}-sub-header`}>{parse(data?.description)}</Typography>
                </Grid>
                <Grid container size={12}>
                    <Grid container size={7} className={`${className}-icon-container`}>
                        <LocationIcon className={`${className}-icon-container-location`} />
                        <Grid className={`${className}-icon-container-textSection`}>
                            <Typography className={`${className}-icon-container-textSection-title`}>Venue</Typography>
                            <Typography className={`${className}-icon-container-textSection-subTitle`}>{data?.venue?.name}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container size={5} className={`${className}-icon-container`}>
                        <CalendarIcon className={`${className}-icon-container-calender`} />
                        <Grid className={`${className}-icon-container-textSection`}>
                            <Typography className={`${className}-icon-container-textSection-title`}>Calender</Typography>
                            <Typography className={`${className}-icon-container-textSection-subTitle`}>{`${getLocalTimeDate(data.startTime ,"MMMM D")} - ${getLocalTimeDate(data.endTime,"D, YYYY")}`}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
})

export default TEventDetails