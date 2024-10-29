import CustomButton from "@/components/CustomButton/CustomButton"
import { Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
const EventInfoCard = (eventData: any) => {
    
    const { handleSubmit, control, setValue, watch, formState: { errors } } = useForm<any>();



    return (
        <Grid className="event-detail-event-info-card" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 10 }}>
                <Grid>
                    <Typography variant="h6">{eventData.eventData.event_info}</Typography>
                </Grid>
            </Grid>
            <Grid container size={{ xs: 12, sm: 10 }} direction={'row'}>
                <Grid container direction={'row'} size={{ xs:12, sm:12 }}>
                    <Grid className="event-detail-event-info-card-event-link">
                    <CustomTextField
                                    placeholder="Event Link"
                                    control={control}
                                    name="event"
                                    type="text"
                                    defaultValue="event-link"
                                    readOnly={true}
                                    
                                />
                    </Grid>
                    <Grid><CustomTextField
                                    placeholder="Event Link"
                                    control={control}
                                    name="event"
                                    type="text"
                                /></Grid>
                </Grid>
                <CustomButton className="event-detail-event-info-card-publish-btn" startIcon={<DoneOutlineOutlinedIcon />} label="Publish Event" />
                <CustomButton className="event-detail-event-info-card-invite-participant-btn" startIcon={<ShareOutlinedIcon />} label="Invite Participant" variant="outlined" />
            </Grid>
        </Grid>
    )
}
export default EventInfoCard;