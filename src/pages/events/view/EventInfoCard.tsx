import CustomButton from "@/components/CustomButton/CustomButton"
import Grid from "@mui/material/Grid2"
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import HTMLReactParser from "html-react-parser/lib/index";
const EventInfoCard = (eventData: any) => {
    const description=HTMLReactParser(typeof eventData?.eventData?.description === 'string' ? eventData?.eventData?.description : '')
    return (
        <Grid className="event-detail-event-info-card" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 10 }}>
                <Grid>
               {description}
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