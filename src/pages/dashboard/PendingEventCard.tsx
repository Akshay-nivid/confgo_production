/**
 * Component displays the pending event card in the dashboard
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import StatusComponent from "@/components/Status/StatusComponent";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {truncateString } from "@/Utils/CommonBaseClass";
import {Tooltip} from '@mui/material';


interface PendingEventCardProps {
    data: {
        id: string | null | undefined,
        name: string,
        startTime: string | null,
        statusId?: string | null | undefined
    } | null
}


export const PendingEventCard: React.FC<PendingEventCardProps> = ({ data }) => {

    const navigate = useNavigate();

    return(
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} >
            <Grid container>
                <Grid container direction={'column'}>
                    <Grid>
                      <Tooltip classes={{ tooltip: 'custom-tooltip'}} title={data?.name || 'No name available'}
                      placement="top">
                      <Typography className="dashboard-pending-event-card-title">
                      {truncateString(data?.name, 20)}
                      </Typography>
                      </Tooltip>
                      </Grid>
                    <Grid className="dashboard-pending-event-card-sub-title">{moment(data?.startTime).format('MMMM D, YYYY')}</Grid>
                </Grid>
                <Grid justifyContent={'center'} alignItems={'center'} ml={2}><StatusComponent value={data?.statusId?.toString()} /></Grid>
            </Grid>
            <Grid container justifyContent={'center'} alignItems={'center'}>
                <Grid><CustomButton className="dashboard-pending-event-card-btn" label={"Publish Now"} onClick={() => navigate(`/events/detail/${data?.id}`)}/></Grid>
            </Grid>
        </Grid>
    )

}