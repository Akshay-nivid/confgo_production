import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";

const Sessions = (eventData: any) => {
    return (
        <Grid className="event-detail-sessions-card" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 10 }}>
                <Grid className="event-detail-sessions-card-session-list" container direction={'column'} spacing={5}>
                    {eventData.eventData.programs.map((item: any) => {
                        return (
                            <Grid container spacing={1} direction={'column'}>
                                <Grid container flexDirection={'column'}>
                                    <Typography className="event-detail-sessions-card-header" >{item.name}</Typography>
                                    <Typography className="event-detail-sessions-card-sub-header" >{item.description}</Typography>
                                    <Typography variant="h6">Start Date & Time: {moment(item.startTime).format('MMM D, YYYY h:mm a')}</Typography>
                                    <Typography variant="h6">End Date & Time: {moment(item.endTime).format('MMM D, YYYY h:mm a')}</Typography>
                                    <Typography variant="h6">Location: {item.location}</Typography>
                                </Grid>
                                {/* <Grid container direction={'row'} spacing={2}>
                                    {item.speakers.map((speaker: any) => {
                                        return (
                                            <Grid container direction={'column'} spacing={2}>
                                                <Typography variant="h6">Speaker: {speaker.name}</Typography>
                                            </Grid>
                                        )
                                    })}
                                </Grid> */}
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Sessions;