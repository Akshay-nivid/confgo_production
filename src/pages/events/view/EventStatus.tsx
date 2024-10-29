import  { useMemo } from 'react';
import Grid from "@mui/material/Grid2"
import { Typography } from '@mui/material';
interface EventStatusProps{
    status:string
}
const EventStatus: React.FC<EventStatusProps>  = ({ status }) => {
    const statusClassName = useMemo(() => {
        switch (status) {
            case 'ACTIVE':
                return 'event-detail-status-box-active';
            case 'inactive':
                return 'status-inactive';
            case 'pending':
                return 'status-pending';
            default:
                return 'status-default';
        }
    }, [status]);
    const statusText = useMemo(() => {
        switch (status) {
            case 'ACTIVE':
                return 'Pending';
            case 'inactive':
                return 'Inactive';
            case 'pending':
                return 'Pending';
            default:
                return 'Unknown Status';
        }
    }, [status]);
    return (
        <Grid container className={statusClassName} ml={2}>
           <Typography textAlign={"center"} variant="h6">{statusText}</Typography>
        </Grid>
    );
}

export default EventStatus;
