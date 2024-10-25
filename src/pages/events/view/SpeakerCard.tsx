import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const SpeakerCard = (eventData: any) => {
  return (
    <Grid className="event-detail-speakers-card" container spacing={2}>
      <Grid container size={{ xs: 12, sm: 10 }}>
        <Grid className="event-detail-speakers-card-speaker-list" direction={'row'} display={'flex'}>
          {eventData.eventData.speakers.map((item: any) => {
            return (
              <Grid container direction={'column'} spacing={1}>
                <img src={item.profile_image} alt={item.name} />
                <Typography variant="h6">{item.name}</Typography>
                <Typography className="event-detail-speakers-card-speaker-designation" variant="body1">{item.designation}</Typography>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}
export default SpeakerCard;