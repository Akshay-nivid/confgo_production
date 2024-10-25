import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const Sessions = (eventData: any) => {
    return (
        <Grid className="event-detail-sessions-card" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 10 }}>
                <Grid className="event-detail-sessions-card-session-list" container direction={'column'} spacing={2}>
                    {eventData.eventData.sessions.map((item: any) => {
                        return (
                            <Grid container spacing={1} direction={'column'}>
                                <Grid container flexDirection={'column'}>
                                    <Typography className="event-detail-sessions-card-header" >{item.title}</Typography>
                                    <Typography className="event-detail-sessions-card-sub-header" >{item.description}</Typography>
                                    <Typography variant="h6">{item.date}</Typography>
                                    <Typography variant="h6">Location: {item.location}</Typography>
                                </Grid>
                                <Grid container direction={'row'} spacing={2}>
                                    {item.speakers.map((speaker: any) => {
                                        return (
                                            <Grid container direction={'column'} spacing={2}>
                                                <Typography variant="h6">Speaker: {speaker.name}</Typography>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Sessions;