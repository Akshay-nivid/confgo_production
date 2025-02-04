/**
 * Component displays the upcoming event card in the dashboard
 */
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {Tooltip} from "@mui/material";


interface UpcomingEventCardProps {
    data: {
        id: string | null | undefined,
        name: string,
        startTime: string | null
    } | null
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({ data }) => {

    const navigate = useNavigate();

    return(
        <Grid container size={{ xs: 12, sm: 12 }} direction={'column'}>
            {/* <Grid className="dashboard-upcoming-event-card-title">{data?.name}</Grid> */}
            <Tooltip title={data?.name || ''} arrow>
            <Grid 
                className="dashboard-upcoming-event-card-title" >
                {data?.name}
            </Grid>
        </Tooltip>
            <Grid className="dashboard-upcoming-event-card-date">{moment(data?.startTime).format('MMMM D, YYYY')}</Grid>
            <Grid className="dashboard-upcoming-event-card-button" container justifyContent={'center'} alignItems={'center'}><Typography onClick={() => navigate(`/events/detail/${data?.id}`)}>Upcoming</Typography></Grid>
        </Grid>
    )

}