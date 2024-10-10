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
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Event Details</Typography>
        </Grid>
        <Grid container direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}  size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-container" >
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-title">{data?.event?.name}</Typography>
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">{data?.event?.type? toSentenceCase(data.event.type): ''}</Typography>
            {data?.event?.description && <><span>&bull; {data?.event?.description}.</span><br /></>}
            {data?.event?.date && <><span>&bull; {moment(data?.event?.date).format("MMMM D, YYYY dddd")}.</span><br /></>}
            {data?.event?.venue && <><span>&bull; {data?.event?.venue}.</span><br /></>}
            {data?.event?.specialty && <><span>&bull; {data?.event?.specialty}.</span><br /></>}
            {data?.event?.agenda && <><span>&bull; {data?.event?.agenda}.</span><br /></>}
            {data?.event?.speakers && <><span>&bull; {data?.event?.speakers}.</span><br /></>}
            {data?.program?.length > 0 && <><Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Programmes</Typography>
             {
                data?.program?.map((item: any) => {
                    return (<><span>&bull; {`${item.sessionStartTime? moment(item.sessionStartTime, "HH:mm").format("h:mm A"):''} - ${item.sessionEndTime? moment(item.sessionEndTime, "HH:mm").format("h:mm A"):''} : ${item.programName}`}.</span><br />
                    {item?.programDescription && <><span className="indent">&bull; {item?.programDescription}.</span><br /></>}
                    {item?.speaker && <><span className="indent">&bull; {item?.speaker}.</span><br /></>}
                    {item?.location && <><span className="indent">&bull; {item?.location}.</span><br /></>}
                    {item?.type && <><span className="indent">&bull; {item?.type}.</span><br /></>}
                    {item?.price && <><span className="indent">&bull; {item?.price}.</span><br /></>}
                        {item?.food && (
                            <>
                                <span className="indent">
                                    &bull; {`${item.food}${item.beverage ? `, ${item.beverage}` : ''}${item.attendees ? `, ${item.attendees} attendees` : ''}${item.mealTime ? `, ${moment(item.mealTime, "HH:mm").format("h:mm A")}` : ''}`}.
                                </span>
                                <br />
                            </>
                        )}
                    </>)
                })
            }</>}
        </Grid>
    </Grid>
});
  
  export default ConferenceDetails;