/**
 * ConferenceDetails component displays the conference details
 */
import { getValueFromArrayBasedOnParameter, toSentenceCase } from '@/Utils/CommonBaseClass';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import moment from 'moment';
import React from 'react';
import parse from 'html-react-parser';
import DateIcon from '@/assets/svg/event-date.svg';
import LocationIcon from '@/assets/svg/event-location.svg';


type ConferenceDetailsProps = {
    data: any;
    addOnOptions?: any;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = React.memo(({ data, addOnOptions }) => {

    const startDate = moment(data?.event?.startDate).format("MMMM D, YYYY");
    const endDate = moment(data?.event?.endDate).format("MMMM D, YYYY");
    /**
     * Method checks the start and end date matches or not
     * @param start 
     * @param end 
     * @returns 
     */
    const checkDateCondition = (start: any, end: any) => {
        return new Date(start) === new Date(end);
    }

    /**
     * Method groups the data based on the date
     */
    const groupedData = data?.program?.reduce((acc: any, program: any) => {
        const date = moment(program.startTime).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(program);
        return acc;
    }, {});


    return <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'} alignItems={'center'} className="custom-stepper-conference-details">
        <Grid size={{ xs: 12, sm: 12 }}>
            <Typography textAlign={"center"} variant="h3" className="custom-stepper-conference-details-content-title">Review And Submit</Typography>
        </Grid>
        <Grid container direction={'column'} size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-container" spacing={2}>
            <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-header-container" alignItems={'center'}>
                <Typography variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">{data?.event?.name}</Typography>
            </Grid>
            {data?.event?.type && <Grid container sx={{ width: 'fit-content' }} className="custom-stepper-conference-details-content-type" justifyContent={'flex-start'} alignItems={'center'}>
                {toSentenceCase(data.event.type)}
            </Grid>}
            <Grid container size={{ xs: 12, sm: 12 }} spacing={2}>
                <Grid className="custom-stepper-conference-details-content-date-icon"><DateIcon /></Grid>
                <Grid>{checkDateCondition(data?.event?.startDate, data?.event?.endDate) ? startDate : `${startDate} - ${endDate}`}</Grid>
            </Grid>
            {data?.event?.type !== 'ONLINE' && data?.event?.location && <Grid container size={{ xs: 12, sm: 12 }} spacing={2}>
                <Grid className="custom-stepper-conference-details-content-date-icon"><LocationIcon /></Grid>
                <Grid>{data?.event?.location}</Grid>
            </Grid>}
            <Grid>
                {parse(data?.event?.description)}
            </Grid>
            <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-header-container" alignItems={'center'}>
                <Typography variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Programs</Typography>
            </Grid>
            {groupedData && Object.keys(groupedData)?.map((date: any) => (
                <Grid container spacing={2}>
                    <Grid container sx={{ width: 'fit-content' }} className="custom-stepper-conference-details-content-date" justifyContent={'flex-start'} alignItems={'center'}>
                        <DateIcon />{moment(date).format('MMMM D')}</Grid>
                    {groupedData[date].map((program: any) => (
                        <Grid container size={{ xs: 12, sm: 12 }} alignItems={'center'}>
                            <Grid container sx={{ width: 'fit-content' }} className="custom-stepper-conference-details-content-time" justifyContent={'flex-start'} alignItems={'center'}>
                                {moment(program.startDateTime).format('h:mm A')}
                            </Grid>
                            {program.programType === 'PROGRAM' ? <><Grid>{`${program.name}:`}</Grid>
                                <Grid>{program.description}</Grid></> : <Grid>{`${getValueFromArrayBasedOnParameter(addOnOptions, 'value', program.addonId, 'label')}`}</Grid>
                            }
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Grid>
    </Grid>
});

export default ConferenceDetails;