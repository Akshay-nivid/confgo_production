/**
 * ConferenceDetails component displays the conference details
 */
import { toSentenceCase } from '@/Utils/CommonBaseClass';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import moment from 'moment';
import React from 'react';

type ConferenceDetailsProps = {
    data: any;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = React.memo(({data}) => {

    return <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'} alignItems={'center'} className="custom-stepper-conference-details">
        <Grid size={{ xs: 12, sm: 12 }}>
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Conference Details</Typography>
        </Grid>
        <Grid container direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}  size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-container" >
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-title">{data?.event?.name}</Typography>
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">{data?.event?.type? toSentenceCase(data.event.type): ''}</Typography>
            {data?.event?.date && <><span>&bull; {moment(data?.event?.date).format("MMMM D, YYYY dddd")}.</span><br /></>}
            {data?.event?.venue && <><span>&bull; {data?.event?.venue}.</span><br /></>}
            {data?.program?.length > 0 && <><Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Programmes</Typography>
             {
                data?.program?.map((item: any) => {
                    return (<><span>&bull; {`${item.sessionStartTime? moment(item.sessionStartTime, "HH:mm").format("h:mm A"):''}: ${item.programName}: ${item.programDescription}`}.</span><br /></>)
                })
            }</>}
        </Grid>
    </Grid>
});
  
  export default ConferenceDetails;