/**
 * Component displays the upcoming event card in the dashboard
 */
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";


export const UpcomingEventCard = () => {

    return(
        <Grid container size={{ xs: 12, sm: 12 }} direction={'column'}>
            <Grid className="dashboard-upcoming-event-card-title">Annual Business Conference</Grid>
            <Grid className="dashboard-upcoming-event-card-date">September 25, 2024</Grid>
            <Grid className="dashboard-upcoming-event-card-button" container justifyContent={'center'} alignItems={'center'}><Typography>Upcoming</Typography></Grid>
        </Grid>
    )

}