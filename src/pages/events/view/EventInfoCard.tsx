import CustomButton from "@/components/CustomButton/CustomButton"
import { Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
const EventInfoCard = (eventData: any) => {
    return (
        <Grid className="event-detail-event-info-card" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 10 }}>
                <Grid>
                    <Typography variant="h6">{eventData?.eventData?.description}</Typography>
                </Grid>
            </Grid>
            <Grid container size={{ xs: 12, sm: 10 }} direction={'row'}>
                <CustomButton className="event-detail-event-info-card-publish-btn" startIcon={<DoneOutlineOutlinedIcon />} label="Publish Event" />
                <CustomButton className="event-detail-event-info-card-invite-participant-btn" startIcon={<ShareOutlinedIcon />} label="Invite Participant" variant="outlined" />
            </Grid>
        </Grid>
    )
}
export default EventInfoCard;